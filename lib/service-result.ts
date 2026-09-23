export const SERVICE_ERROR_CODES = [
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "VALIDATION_FAILED",
  "RATE_LIMITED",
  "INTERNAL",
] as const;

export type ServiceErrorCode = (typeof SERVICE_ERROR_CODES)[number];

export type ServiceError = {
  code: ServiceErrorCode;
  message: string;
  details?: unknown;
};

export type ServiceResult<T> =
  { ok: true; data: T } | { ok: false; error: ServiceError };

export function serviceSuccess<T>(data: T): ServiceResult<T> {
  return { ok: true, data };
}

export function serviceFailure(
  code: ServiceErrorCode,
  message: string,
  details?: unknown,
): ServiceResult<never> {
  return {
    ok: false,
    error:
      details === undefined ? { code, message } : { code, message, details },
  };
}
