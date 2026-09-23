import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  startDemoState,
  type DemoState,
} from "@/features/demo-state/demo-state";

describe("startDemoState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("moves from loading to deterministic success and releases its timer", async () => {
    const states: DemoState<{ id: string }>[] = [];
    const task = startDemoState({
      scenario: "success",
      data: { id: "project-1" },
      delayMs: 250,
      onStateChange: (state) => states.push(state),
    });

    expect(states).toEqual([{ status: "loading" }]);
    expect(vi.getTimerCount()).toBe(1);

    await vi.advanceTimersByTimeAsync(250);

    expect(states).toEqual([
      { status: "loading" },
      { status: "success", data: { id: "project-1" } },
    ]);
    await expect(task.completion).resolves.toEqual({
      status: "completed",
      state: { status: "success", data: { id: "project-1" } },
    });
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([
    ["empty", { status: "empty" }],
    [
      "failure",
      {
        status: "failure",
        error: { code: "INTERNAL", message: "Simulated demo failure." },
      },
    ],
  ] as const)("settles the %s scenario", async (scenario, expectedState) => {
    const states: DemoState<never>[] = [];
    const task = startDemoState({
      scenario,
      delayMs: 0,
      onStateChange: (state) => states.push(state),
    });

    await vi.runAllTimersAsync();

    expect(states.at(-1)).toEqual(expectedState);
    await expect(task.completion).resolves.toEqual({
      status: "completed",
      state: expectedState,
    });
  });

  it("marks rate limiting as an explicit simulation", async () => {
    const states: DemoState<never>[] = [];
    const task = startDemoState({
      scenario: "rate-limited",
      details: { retryAfterMs: 1_000 },
      delayMs: 10,
      onStateChange: (state) => states.push(state),
    });

    await vi.advanceTimersByTimeAsync(10);

    expect(states.at(-1)).toEqual({
      status: "failure",
      error: {
        code: "RATE_LIMITED",
        message: "Simulated rate limit; no real request was limited.",
        details: { retryAfterMs: 1_000 },
      },
    });
    await expect(task.completion).resolves.toMatchObject({
      status: "completed",
      state: { status: "failure" },
    });
  });

  it("cancels idempotently, clears the timer, and emits no terminal state", async () => {
    const states: DemoState<string>[] = [];
    const task = startDemoState({
      scenario: "success",
      data: "finished",
      delayMs: 500,
      onStateChange: (state) => states.push(state),
    });

    task.cancel();
    task.cancel();

    expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(500);
    expect(states).toEqual([{ status: "loading" }]);
    await expect(task.completion).resolves.toEqual({ status: "cancelled" });
  });

  it("rejects completion and releases the timer when a listener fails", async () => {
    const listenerError = new Error("Demo consumer failed.");
    const task = startDemoState({
      scenario: "failure",
      error: { code: "FORBIDDEN", message: "Action is not available." },
      delayMs: 25,
      onStateChange: (state) => {
        if (state.status === "failure") throw listenerError;
      },
    });
    const rejection = expect(task.completion).rejects.toBe(listenerError);

    await vi.advanceTimersByTimeAsync(25);

    await rejection;
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects the invalid delay %s before scheduling work",
    (delayMs) => {
      const onStateChange = vi.fn();

      expect(() =>
        startDemoState({
          scenario: "empty",
          delayMs,
          onStateChange,
        }),
      ).toThrow("Demo delay must be a finite, non-negative number.");
      expect(onStateChange).not.toHaveBeenCalled();
      expect(vi.getTimerCount()).toBe(0);
    },
  );
});
