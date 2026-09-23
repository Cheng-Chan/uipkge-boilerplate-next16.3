import { z } from "zod";

import { demoUserIdSchema } from "@/features/auth/types";
import { projectIdSchema } from "@/features/projects/schema";

export const taskStatusSchema = z.enum([
  "backlog",
  "todo",
  "in-progress",
  "review",
  "done",
]);

export const taskPrioritySchema = z.enum(["low", "medium", "high"]);

export const taskIdSchema = z.string().regex(/^task-[a-z0-9]+(?:-[a-z0-9]+)*$/);

const editableTaskFieldsSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500),
  priority: taskPrioritySchema,
  assigneeId: demoUserIdSchema.nullable(),
  dueDate: z.iso.date().nullable(),
});

export const taskSchema = editableTaskFieldsSchema
  .extend({
    id: taskIdSchema,
    projectId: projectIdSchema,
    status: taskStatusSchema,
    position: z.number().int().nonnegative().max(1_000),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export const taskUpdateInputSchema = editableTaskFieldsSchema
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one task field to update.",
  });

export const taskMoveInputSchema = z
  .object({
    status: taskStatusSchema,
    position: z.number().int().nonnegative().max(1_000),
  })
  .strict();

export const taskListSchema = z.array(taskSchema).max(500);

export type Task = z.infer<typeof taskSchema>;
export type TaskMoveInput = z.input<typeof taskMoveInputSchema>;
export type TaskUpdateInput = z.input<typeof taskUpdateInputSchema>;
