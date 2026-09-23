import { z } from "zod";

import { demoUserIdSchema } from "@/features/auth/types";

export const LOCAL_MESSAGE_NOTICE =
  "Local simulation only — this message is not delivered to anyone.";

export const messageThreadIdSchema = z
  .string()
  .regex(/^thread-[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const messageIdSchema = z
  .string()
  .regex(/^message-[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const localMessageSchema = z
  .object({
    id: messageIdSchema,
    authorId: demoUserIdSchema,
    body: z.string().trim().min(1).max(2_000),
    sentAt: z.string().datetime({ offset: true }),
    delivery: z.literal("local-simulation"),
    deliveryNotice: z.literal(LOCAL_MESSAGE_NOTICE),
  })
  .strict();

export const messageThreadSchema = z
  .object({
    id: messageThreadIdSchema,
    subject: z.string().trim().min(2).max(120),
    participantIds: z
      .array(demoUserIdSchema)
      .min(2)
      .max(3)
      .refine((ids) => new Set(ids).size === ids.length, {
        message: "Thread participants must be unique.",
      }),
    messages: z.array(localMessageSchema).max(200),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .strict()
  .superRefine((thread, context) => {
    thread.messages.forEach((message, index) => {
      if (!thread.participantIds.includes(message.authorId)) {
        context.addIssue({
          code: "custom",
          message: "Message author must be a thread participant.",
          path: ["messages", index, "authorId"],
        });
      }
      if (
        index > 0 &&
        Date.parse(message.sentAt) <
          Date.parse(thread.messages[index - 1].sentAt)
      ) {
        context.addIssue({
          code: "custom",
          message: "Messages must be ordered by sent time.",
          path: ["messages", index, "sentAt"],
        });
      }
    });
  });

export const messageThreadListSchema = z.array(messageThreadSchema).max(50);

export const sendMessageInputSchema = z
  .object({
    threadId: messageThreadIdSchema,
    authorId: demoUserIdSchema,
    body: z.string().trim().min(1).max(2_000),
  })
  .strict();

export type LocalMessage = z.infer<typeof localMessageSchema>;
export type MessageThread = z.infer<typeof messageThreadSchema>;
export type SendMessageInput = z.input<typeof sendMessageInputSchema>;
