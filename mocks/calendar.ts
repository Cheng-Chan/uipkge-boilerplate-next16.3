import type { CalendarEvent } from "@/features/calendar/schema";

export const CALENDAR_EVENT_FIXTURES = [
  {
    id: "event-demo-kickoff",
    projectId: "project-demo-orbit",
    title: "Orbit demo kickoff",
    description: "Review the fictional workspace goals and sample milestones.",
    kind: "meeting",
    startAt: "2026-01-19T09:00:00.000Z",
    endAt: "2026-01-19T10:00:00.000Z",
    allDay: false,
    accessibleSummary:
      "Orbit demo kickoff meeting on January 19 from 09:00 to 10:00 UTC.",
    createdAt: "2025-12-01T08:00:00.000Z",
    updatedAt: "2025-12-01T08:00:00.000Z",
  },
  {
    id: "event-demo-review",
    projectId: "project-demo-lantern",
    title: "Lantern sample review",
    description: "Review the local prototype with the demo team.",
    kind: "meeting",
    startAt: "2026-01-21T14:00:00.000+07:00",
    endAt: "2026-01-21T15:30:00.000+07:00",
    allDay: false,
    accessibleSummary:
      "Lantern sample review on January 21 from 14:00 to 15:30 UTC plus 7.",
    createdAt: "2025-12-10T07:00:00.000Z",
    updatedAt: "2025-12-14T07:30:00.000Z",
  },
  {
    id: "event-demo-deadline",
    projectId: "project-demo-harbor",
    title: "Harbor demo notes due",
    description: "Complete the illustrative discovery notes.",
    kind: "deadline",
    startAt: "2026-01-30T00:00:00.000Z",
    endAt: "2026-01-31T00:00:00.000Z",
    allDay: true,
    accessibleSummary:
      "All-day deadline for Harbor demo notes on January 30, 2026.",
    createdAt: "2025-12-05T12:00:00.000Z",
    updatedAt: "2025-12-05T12:00:00.000Z",
  },
] as const satisfies readonly CalendarEvent[];
