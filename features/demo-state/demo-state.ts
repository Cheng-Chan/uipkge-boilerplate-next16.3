import type { ServiceError, ServiceErrorCode } from "@/lib/service-result";

export const DEFAULT_DEMO_DELAY_MS = 300;

type NonRateLimitedErrorCode = Exclude<ServiceErrorCode, "RATE_LIMITED">;

export type DemoState<T> =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "failure"; error: ServiceError }
  | { status: "success"; data: T };

export type SettledDemoState<T> = Exclude<DemoState<T>, { status: "loading" }>;

type DemoStateOptionsBase<T> = {
  delayMs?: number;
  onStateChange: (state: DemoState<T>) => void;
};

export type DemoStateOptions<T> = DemoStateOptionsBase<T> &
  (
    | { scenario: "empty" }
    | {
        scenario: "failure";
        error?: ServiceError & { code: NonRateLimitedErrorCode };
      }
    | { scenario: "rate-limited"; details?: unknown }
    | { scenario: "success"; data: T }
  );

export type DemoStateTaskResult<T> =
  { status: "cancelled" } | { status: "completed"; state: SettledDemoState<T> };

export type DemoStateTask<T> = {
  cancel: () => void;
  completion: Promise<DemoStateTaskResult<T>>;
};

function defaultFailure(): ServiceError {
  return {
    code: "INTERNAL",
    message: "Simulated demo failure.",
  };
}

function rateLimitedFailure(details?: unknown): ServiceError {
  const error = {
    code: "RATE_LIMITED" as const,
    message: "Simulated rate limit; no real request was limited.",
  };

  return details === undefined ? error : { ...error, details };
}

function settleScenario<T>(options: DemoStateOptions<T>): SettledDemoState<T> {
  switch (options.scenario) {
    case "empty":
      return { status: "empty" };
    case "failure":
      return {
        status: "failure",
        error: options.error ?? defaultFailure(),
      };
    case "rate-limited":
      return {
        status: "failure",
        error: rateLimitedFailure(options.details),
      };
    case "success":
      return { status: "success", data: options.data };
  }
}

function validateDelay(delayMs: number) {
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new RangeError("Demo delay must be a finite, non-negative number.");
  }
}

export function startDemoState<T = never>(
  options: DemoStateOptions<T>,
): DemoStateTask<T> {
  const delayMs = options.delayMs ?? DEFAULT_DEMO_DELAY_MS;
  validateDelay(delayMs);

  options.onStateChange({ status: "loading" });

  let settled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let resolveCompletion!: (result: DemoStateTaskResult<T>) => void;
  let rejectCompletion!: (reason: unknown) => void;

  const completion = new Promise<DemoStateTaskResult<T>>((resolve, reject) => {
    resolveCompletion = resolve;
    rejectCompletion = reject;
  });

  timer = setTimeout(() => {
    timer = undefined;
    if (settled) return;

    const state = settleScenario(options);
    settled = true;

    try {
      options.onStateChange(state);
      resolveCompletion({ status: "completed", state });
    } catch (error) {
      rejectCompletion(error);
    }
  }, delayMs);

  return {
    completion,
    cancel() {
      if (settled) return;

      settled = true;
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }
      resolveCompletion({ status: "cancelled" });
    },
  };
}
