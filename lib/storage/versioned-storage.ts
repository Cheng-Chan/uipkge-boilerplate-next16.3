import { z } from "zod";

export const STORAGE_KEY_PREFIX = "uipkge.demo";

export type StorageOperation = "read" | "reset" | "write";
export type StorageSource = "memory" | "persistent";

export type StorageValidationIssue = {
  message: string;
  path: string;
};

export type StorageIssue =
  | { reason: "CORRUPT_JSON"; operation: "read" }
  | {
      reason: "INVALID_DATA";
      operation: "read";
      issues: StorageValidationIssue[];
    }
  | {
      reason: "INVALID_ENVELOPE";
      operation: "read";
      issues: StorageValidationIssue[];
    }
  | {
      reason: "INVALID_VALUE";
      operation: "write";
      issues: StorageValidationIssue[];
    }
  | { reason: "NOT_JSON_COMPATIBLE"; operation: "write" }
  | { reason: "QUOTA_EXCEEDED"; operation: "write" }
  | { reason: "READ_FAILED"; operation: "read" }
  | { reason: "REMOVE_FAILED"; operation: "reset" }
  | { reason: "STORAGE_UNAVAILABLE"; operation: StorageOperation }
  | {
      reason: "UNKNOWN_VERSION";
      operation: "read";
      actualVersion: number;
      expectedVersion: number;
    }
  | { reason: "WRITE_FAILED"; operation: "write" };

type StorageAccess = {
  source: StorageSource;
  warning?: StorageIssue;
};

export type StorageRead<T> = StorageAccess &
  ({ found: false } | { found: true; value: T });

export type StorageReset = StorageAccess & { cleared: true };

export type StorageWrite<T> = StorageAccess & { value: T };

type StorageFailure = {
  ok: false;
  error: {
    code: "INTERNAL" | "VALIDATION_FAILED";
    message: string;
    details: StorageIssue;
  };
};

export type StorageResult<T> = { ok: true; data: T } | StorageFailure;

export type StorageLike = Pick<Storage, "getItem" | "removeItem" | "setItem">;
export type StorageProvider = () => StorageLike | undefined;

export type VersionedStorage<T> = {
  key: string;
  read: () => StorageResult<StorageRead<T>>;
  reset: () => StorageResult<StorageReset>;
  version: number;
  write: (value: T) => StorageResult<StorageWrite<T>>;
};

export type VersionedStorageOptions<T> = {
  getStorage?: StorageProvider;
  name: string;
  schema: z.ZodType<T>;
  version: number;
};

type EncodedValue<T> =
  { ok: true; serialized: string; value: T } | StorageFailure;

const envelopeSchema = z.object({
  data: z.unknown(),
  version: z.number().int().nonnegative(),
});

function validationIssues(error: z.ZodError): StorageValidationIssue[] {
  return error.issues.map((issue) => ({
    message: issue.message,
    path: issue.path.map(String).join("."),
  }));
}

function failure(
  code: StorageFailure["error"]["code"],
  message: string,
  details: StorageIssue,
): StorageFailure {
  return { ok: false, error: { code, message, details } };
}

function success<T>(data: T): StorageResult<T> {
  return { ok: true, data };
}

function storageAccess(
  source: StorageSource,
  warning?: StorageIssue,
): StorageAccess {
  return warning ? { source, warning } : { source };
}

function unavailable(operation: StorageOperation): StorageIssue {
  return { reason: "STORAGE_UNAVAILABLE", operation };
}

function isQuotaExceeded(error: unknown) {
  if (!error || typeof error !== "object" || !("name" in error)) return false;

  return (
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED"
  );
}

export function getBrowserLocalStorage(): StorageLike | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
}

export function getBrowserSessionStorage(): StorageLike | undefined {
  if (typeof window === "undefined") return undefined;
  return window.sessionStorage;
}

export function createVersionedStorageKey(name: string, version: number) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new TypeError(
      "Storage name must contain lowercase letters, numbers, and single hyphens only.",
    );
  }

  if (!Number.isSafeInteger(version) || version < 1) {
    throw new TypeError("Storage version must be a positive safe integer.");
  }

  return `${STORAGE_KEY_PREFIX}:${name}:v${version}`;
}

export function createVersionedStorage<T>(
  options: VersionedStorageOptions<T>,
): VersionedStorage<T> {
  const key = createVersionedStorageKey(options.name, options.version);
  const getStorage = options.getStorage ?? getBrowserLocalStorage;
  let memoryEntry: string | null = null;
  let fallbackWarning: StorageIssue | undefined;
  let memoryIsAuthoritative = false;

  function decode(
    serialized: string,
    source: StorageSource,
    warning?: StorageIssue,
  ): StorageResult<StorageRead<T>> {
    let parsed: unknown;

    try {
      parsed = JSON.parse(serialized);
    } catch {
      return failure(
        "VALIDATION_FAILED",
        "Stored demo data is not valid JSON. Reset this demo data to recover.",
        { reason: "CORRUPT_JSON", operation: "read" },
      );
    }

    const envelope = envelopeSchema.safeParse(parsed);
    if (!envelope.success) {
      return failure(
        "VALIDATION_FAILED",
        "Stored demo data has an invalid envelope. Reset this demo data to recover.",
        {
          reason: "INVALID_ENVELOPE",
          operation: "read",
          issues: validationIssues(envelope.error),
        },
      );
    }

    if (envelope.data.version !== options.version) {
      return failure(
        "VALIDATION_FAILED",
        "Stored demo data uses an unsupported version. Reset this demo data to recover.",
        {
          reason: "UNKNOWN_VERSION",
          operation: "read",
          actualVersion: envelope.data.version,
          expectedVersion: options.version,
        },
      );
    }

    const value = options.schema.safeParse(envelope.data.data);
    if (!value.success) {
      return failure(
        "VALIDATION_FAILED",
        "Stored demo data failed validation. Reset this demo data to recover.",
        {
          reason: "INVALID_DATA",
          operation: "read",
          issues: validationIssues(value.error),
        },
      );
    }

    return success({
      found: true,
      value: value.data,
      ...storageAccess(source, warning),
    });
  }

  function encode(value: T): EncodedValue<T> {
    const validated = options.schema.safeParse(value);
    if (!validated.success) {
      return failure(
        "VALIDATION_FAILED",
        "Demo data was not saved because it failed validation.",
        {
          reason: "INVALID_VALUE",
          operation: "write",
          issues: validationIssues(validated.error),
        },
      );
    }

    let serialized: string;
    try {
      serialized = JSON.stringify({
        data: validated.data,
        version: options.version,
      });
    } catch {
      return failure(
        "VALIDATION_FAILED",
        "Demo data was not saved because it is not JSON-compatible.",
        { reason: "NOT_JSON_COMPATIBLE", operation: "write" },
      );
    }

    const roundTrip = decode(serialized, "memory");
    if (!roundTrip.ok || !roundTrip.data.found) {
      return failure(
        "VALIDATION_FAILED",
        "Demo data was not saved because it is not JSON-compatible.",
        { reason: "NOT_JSON_COMPATIBLE", operation: "write" },
      );
    }

    return { ok: true, serialized, value: roundTrip.data.value };
  }

  function readMemory(warning: StorageIssue): StorageResult<StorageRead<T>> {
    if (memoryEntry === null) {
      return success({ found: false, ...storageAccess("memory", warning) });
    }
    return decode(memoryEntry, "memory", warning);
  }

  return {
    key,
    version: options.version,
    read() {
      if (memoryIsAuthoritative && fallbackWarning) {
        return readMemory(fallbackWarning);
      }

      let storage: StorageLike | undefined;
      try {
        storage = getStorage();
      } catch {
        return readMemory(unavailable("read"));
      }

      if (!storage) return readMemory(unavailable("read"));

      let serialized: string | null;
      try {
        serialized = storage.getItem(key);
      } catch {
        return readMemory({ reason: "READ_FAILED", operation: "read" });
      }

      if (serialized === null) {
        memoryEntry = null;
        return success({
          found: false,
          ...storageAccess("persistent"),
        });
      }

      const decoded = decode(serialized, "persistent");
      if (decoded.ok) memoryEntry = serialized;
      return decoded;
    },
    reset() {
      memoryEntry = null;

      let storage: StorageLike | undefined;
      try {
        storage = getStorage();
      } catch {
        const details = unavailable("reset");
        fallbackWarning = details;
        memoryIsAuthoritative = true;
        return failure(
          "INTERNAL",
          "In-memory demo data was cleared, but persistent storage is unavailable.",
          details,
        );
      }

      if (!storage) {
        const details = unavailable("reset");
        fallbackWarning = details;
        memoryIsAuthoritative = true;
        return failure(
          "INTERNAL",
          "In-memory demo data was cleared, but persistent storage is unavailable.",
          details,
        );
      }

      try {
        storage.removeItem(key);
      } catch {
        const details = {
          reason: "REMOVE_FAILED",
          operation: "reset",
        } as const;
        fallbackWarning = details;
        memoryIsAuthoritative = true;
        return failure(
          "INTERNAL",
          "In-memory demo data was cleared, but persistent data could not be removed.",
          details,
        );
      }

      fallbackWarning = undefined;
      memoryIsAuthoritative = false;
      return success({
        cleared: true,
        ...storageAccess("persistent"),
      });
    },
    write(value) {
      const encoded = encode(value);
      if (!encoded.ok) return encoded;

      let storage: StorageLike | undefined;
      try {
        storage = getStorage();
      } catch {
        storage = undefined;
      }

      if (!storage) {
        const warning = unavailable("write");
        memoryEntry = encoded.serialized;
        fallbackWarning = warning;
        memoryIsAuthoritative = true;
        return success({
          value: encoded.value,
          ...storageAccess("memory", warning),
        });
      }

      try {
        storage.setItem(key, encoded.serialized);
      } catch (error) {
        const warning: StorageIssue = isQuotaExceeded(error)
          ? { reason: "QUOTA_EXCEEDED", operation: "write" }
          : { reason: "WRITE_FAILED", operation: "write" };
        memoryEntry = encoded.serialized;
        fallbackWarning = warning;
        memoryIsAuthoritative = true;
        return success({
          value: encoded.value,
          ...storageAccess("memory", warning),
        });
      }

      memoryEntry = encoded.serialized;
      fallbackWarning = undefined;
      memoryIsAuthoritative = false;
      return success({
        value: encoded.value,
        ...storageAccess("persistent"),
      });
    },
  };
}
