import {
  LOCAL_MESSAGE_NOTICE,
  type MessageThread,
} from "@/features/messages/schema";

export const MESSAGE_THREAD_FIXTURES = [
  {
    id: "thread-demo-lantern",
    subject: "Lantern demo review",
    participantIds: ["demo-user-admin", "demo-user-manager"],
    messages: [
      {
        id: "message-demo-lantern-brief",
        authorId: "demo-user-admin",
        body: "The fictional Lantern review notes are ready in this local demo.",
        sentAt: "2025-12-18T08:00:00.000Z",
        delivery: "local-simulation",
        deliveryNotice: LOCAL_MESSAGE_NOTICE,
      },
      {
        id: "message-demo-lantern-reply",
        authorId: "demo-user-manager",
        body: "I will review the sample notes during the demo session.",
        sentAt: "2025-12-18T08:20:00.000Z",
        delivery: "local-simulation",
        deliveryNotice: LOCAL_MESSAGE_NOTICE,
      },
    ],
    updatedAt: "2025-12-18T08:20:00.000Z",
  },
  {
    id: "thread-demo-workspace",
    subject: "Sample workspace feedback",
    participantIds: ["demo-user-manager", "demo-user-viewer"],
    messages: [
      {
        id: "message-demo-workspace-question",
        authorId: "demo-user-viewer",
        body: "The sample workspace summary is clear in the read-only view.",
        sentAt: "2025-12-16T15:00:00.000Z",
        delivery: "local-simulation",
        deliveryNotice: LOCAL_MESSAGE_NOTICE,
      },
    ],
    updatedAt: "2025-12-16T15:00:00.000Z",
  },
] as const satisfies readonly MessageThread[];
