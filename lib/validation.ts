import type { z } from "zod";

import { serviceFailure, type ServiceResult } from "@/lib/service-result";

export type ValidationIssue = {
  message: string;
  path: string;
};

export function validationFailure(
  message: string,
  error: z.ZodError,
): ServiceResult<never> {
  const issues: ValidationIssue[] = error.issues.map((issue) => ({
    message: issue.message,
    path: issue.path.map(String).join("."),
  }));

  return serviceFailure("VALIDATION_FAILED", message, { issues });
}
