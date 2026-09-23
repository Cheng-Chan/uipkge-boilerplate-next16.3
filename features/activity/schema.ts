import { z } from "zod";

import { projectIdSchema } from "@/features/projects/schema";

export const activityIdSchema = z
  .string()
  .regex(/^activity-[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const activityKindSchema = z.enum([
  "project",
  "task",
  "calendar",
  "message",
]);

export const activitySchema = z
  .object({
    id: activityIdSchema,
    projectId: projectIdSchema.nullable(),
    kind: activityKindSchema,
    occurredAt: z.string().datetime({ offset: true }),
    summary: z.string().trim().min(5).max(200),
    accessibleSummary: z.string().trim().min(10).max(300),
  })
  .strict();

export const activityListSchema = z.array(activitySchema).max(500);

export type Activity = z.infer<typeof activitySchema>;
