import type { NextConfig } from "next";

import { parseEnvironment } from "./config/environment";

parseEnvironment({
  NEXT_PUBLIC_MAPBOX_ENABLED: process.env.NEXT_PUBLIC_MAPBOX_ENABLED,
  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
});

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
