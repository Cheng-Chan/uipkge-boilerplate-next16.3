import { describe, expect, it } from "vitest";

import { activityListSchema } from "@/features/activity/schema";
import { calendarEventListSchema } from "@/features/calendar/schema";
import { taskListSchema } from "@/features/tasks/schema";
import { ACTIVITY_FIXTURES } from "@/mocks/activity";
import { CALENDAR_EVENT_FIXTURES } from "@/mocks/calendar";
import { PROJECT_FIXTURES } from "@/mocks/projects";
import { TASK_FIXTURES } from "@/mocks/tasks";
import { DEMO_USERS } from "@/mocks/users";

describe("workflow fixtures", () => {
  it("validates stable task fixtures and their relationships", () => {
    expect(taskListSchema.parse(TASK_FIXTURES)).toHaveLength(5);
    expect(new Set(TASK_FIXTURES.map(({ id }) => id)).size).toBe(
      TASK_FIXTURES.length,
    );
    const projects = new Set<string>(PROJECT_FIXTURES.map(({ id }) => id));
    const users = new Set<string>(DEMO_USERS.map(({ id }) => id));
    expect(
      TASK_FIXTURES.every(
        (task) =>
          projects.has(task.projectId) &&
          (task.assigneeId === null || users.has(task.assigneeId)),
      ),
    ).toBe(true);
  });

  it("validates explicitly dated calendar fixtures with accessible summaries", () => {
    expect(calendarEventListSchema.parse(CALENDAR_EVENT_FIXTURES)).toHaveLength(
      3,
    );
    expect(
      CALENDAR_EVENT_FIXTURES.every(
        (event) =>
          Date.parse(event.endAt) > Date.parse(event.startAt) &&
          event.accessibleSummary.length >= 10,
      ),
    ).toBe(true);
  });

  it("validates descending, readable activity fixtures", () => {
    expect(activityListSchema.parse(ACTIVITY_FIXTURES)).toHaveLength(4);
    const timestamps = ACTIVITY_FIXTURES.map(({ occurredAt }) =>
      Date.parse(occurredAt),
    );
    expect(timestamps).toEqual([...timestamps].sort((a, b) => b - a));
    expect(
      ACTIVITY_FIXTURES.every(({ accessibleSummary }) =>
        accessibleSummary.endsWith("."),
      ),
    ).toBe(true);
  });
});
