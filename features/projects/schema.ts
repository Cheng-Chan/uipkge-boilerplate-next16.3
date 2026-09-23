import { z } from "zod";

import { customerIdSchema } from "@/features/customers/schema";

export const projectStatusSchema = z.enum([
  "planned",
  "active",
  "paused",
  "completed",
]);

export const projectIdSchema = z
  .string()
  .regex(/^project-[a-z0-9]+(?:-[a-z0-9]+)*$/);

const dateOnlySchema = z.iso.date();

const projectFieldsSchema = z.object({
  customerId: customerIdSchema,
  name: z.string().trim().min(2).max(100),
  status: projectStatusSchema,
  startDate: dateOnlySchema,
  endDate: dateOnlySchema,
  budgetCents: z.number().int().nonnegative().max(100_000_000),
});

function datesAreOrdered(value: { startDate: string; endDate: string }) {
  return value.endDate >= value.startDate;
}

export const projectSchema = projectFieldsSchema
  .extend({
    id: projectIdSchema,
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .strict()
  .refine(datesAreOrdered, {
    message: "Project end date must not be before its start date.",
    path: ["endDate"],
  });

export const projectCreateInputSchema = projectFieldsSchema
  .strict()
  .refine(datesAreOrdered, {
    message: "Project end date must not be before its start date.",
    path: ["endDate"],
  });

export const projectUpdateInputSchema = projectFieldsSchema
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one project field to update.",
  });

export const projectListSchema = z.array(projectSchema).max(200);

export type Project = z.infer<typeof projectSchema>;
export type ProjectCreateInput = z.input<typeof projectCreateInputSchema>;
export type ProjectUpdateInput = z.input<typeof projectUpdateInputSchema>;
