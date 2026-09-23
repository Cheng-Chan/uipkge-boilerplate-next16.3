import type { Activity } from "@/features/activity/schema";

export const ACTIVITY_FIXTURES = [
  {
    id: "activity-demo-task-review",
    projectId: "project-demo-lantern",
    kind: "task",
    occurredAt: "2025-12-19T09:10:00.000Z",
    summary: "Sample task moved to review",
    accessibleSummary:
      "On December 19, the sample Lantern task moved to the review column.",
  },
  {
    id: "activity-demo-event-added",
    projectId: "project-demo-orbit",
    kind: "calendar",
    occurredAt: "2025-12-18T12:20:00.000Z",
    summary: "Demo kickoff added to calendar",
    accessibleSummary:
      "On December 18, the fictional Orbit kickoff was added to the demo calendar.",
  },
  {
    id: "activity-demo-project-paused",
    projectId: "project-demo-harbor",
    kind: "project",
    occurredAt: "2025-12-01T09:45:00.000Z",
    summary: "Harbor demo project paused",
    accessibleSummary:
      "On December 1, the synthetic Harbor project status changed to paused.",
  },
  {
    id: "activity-demo-message-local",
    projectId: null,
    kind: "message",
    occurredAt: "2025-11-28T15:00:00.000Z",
    summary: "Local sample message recorded",
    accessibleSummary:
      "On November 28, a fictional local-only message was recorded with no external delivery.",
  },
] as const satisfies readonly Activity[];
