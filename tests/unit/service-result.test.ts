import { describe, expect, expectTypeOf, it } from "vitest";

import {
  SERVICE_ERROR_CODES,
  serviceFailure,
  serviceSuccess,
  type ServiceErrorCode,
  type ServiceResult,
} from "@/lib/service-result";

function describeResult(result: ServiceResult<{ id: string }>) {
  if (result.ok) {
    expectTypeOf(result.data).toEqualTypeOf<{ id: string }>();
    return result.data.id;
  }

  expectTypeOf(result.error.code).toEqualTypeOf<ServiceErrorCode>();
  return result.error.code;
}

describe("ServiceResult", () => {
  it("keeps the approved error vocabulary explicit", () => {
    expect(SERVICE_ERROR_CODES).toEqual([
      "UNAUTHORIZED",
      "FORBIDDEN",
      "NOT_FOUND",
      "VALIDATION_FAILED",
      "RATE_LIMITED",
      "INTERNAL",
    ]);
  });

  it("narrows successful and failed results by the ok discriminant", () => {
    const success = serviceSuccess({ id: "project-1" });
    const failure = serviceFailure("NOT_FOUND", "Project was not found.");

    expect(describeResult(success)).toBe("project-1");
    expect(describeResult(failure)).toBe("NOT_FOUND");
  });

  it("includes failure details only when supplied", () => {
    expect(serviceFailure("INTERNAL", "Unexpected demo failure.")).toEqual({
      ok: false,
      error: {
        code: "INTERNAL",
        message: "Unexpected demo failure.",
      },
    });
    expect(
      serviceFailure("VALIDATION_FAILED", "Check the fields.", {
        fields: ["name"],
      }),
    ).toEqual({
      ok: false,
      error: {
        code: "VALIDATION_FAILED",
        message: "Check the fields.",
        details: { fields: ["name"] },
      },
    });
  });
});
