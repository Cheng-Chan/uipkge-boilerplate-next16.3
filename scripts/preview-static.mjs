import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, relative, resolve, sep } from "node:path";
import process from "node:process";

const outputDirectory = resolve(process.cwd(), "out");
const notFoundFile = resolve(outputDirectory, "404.html");

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function readOption(name, fallback) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

function parsePort(value) {
  const port = Number.parseInt(value, 10);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`Invalid preview port: ${value}`);
  }

  return port;
}

const host = readOption("--host", process.env.PREVIEW_HOST ?? "127.0.0.1");
const port = parsePort(
  readOption("--port", process.env.PREVIEW_PORT ?? "4173"),
);

function isInsideOutput(filePath) {
  const pathFromOutput = relative(outputDirectory, filePath);
  return (
    pathFromOutput === "" ||
    (!pathFromOutput.startsWith(`..${sep}`) && pathFromOutput !== "..")
  );
}

async function isFile(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function resolveRequest(pathname) {
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  if (decodedPath.includes("\0")) {
    return null;
  }

  const requestedPath = resolve(outputDirectory, `.${decodedPath}`);

  if (!isInsideOutput(requestedPath)) {
    return null;
  }

  const candidates = decodedPath.endsWith("/")
    ? [resolve(requestedPath, "index.html")]
    : [
        requestedPath,
        `${requestedPath}.html`,
        resolve(requestedPath, "index.html"),
      ];

  for (const candidate of candidates) {
    if (isInsideOutput(candidate) && (await isFile(candidate))) {
      return candidate;
    }
  }

  return null;
}

function streamFile(response, filePath, statusCode, method) {
  response.writeHead(statusCode, {
    "Content-Type":
      mimeTypes.get(extname(filePath).toLowerCase()) ??
      "application/octet-stream",
  });

  if (method === "HEAD") {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
}

await access(notFoundFile).catch(() => {
  throw new Error(
    'Static output is missing. Run "pnpm build" before starting the preview.',
  );
});

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method Not Allowed");
    return;
  }

  try {
    const pathname = new URL(request.url ?? "/", `http://${host}:${port}`)
      .pathname;
    const filePath = await resolveRequest(pathname);

    if (filePath) {
      streamFile(response, filePath, 200, request.method);
      return;
    }

    streamFile(response, notFoundFile, 404, request.method);
  } catch (error) {
    console.error(error);
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Internal Server Error");
  }
});

server.on("error", (error) => {
  console.error(`Static preview failed: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(
    `Static preview serving ${outputDirectory} at http://${host}:${port}`,
  );
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
