import { z } from "zod";

import { projectIdSchema } from "@/features/projects/schema";

export const calendarEventIdSchema = z
  .string()
  .regex(/^event-[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const calendarEventKindSchema = z.enum(["meeting", "deadline", "focus"]);

const calendarEventFieldsSchema = z.object({
  projectId: projectIdSchema.nullable(),
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500),
  kind: calendarEventKindSchema,
  startAt: z.string().datetime({ offset: true }),
  endAt: z.string().datetime({ offset: true }),
  allDay: z.boolean(),
  accessibleSummary: z.string().trim().min(10).max(300),
});

function datesAreOrdered(value: { startAt: string; endAt: string }) {
  return Date.parse(value.endAt) > Date.parse(value.startAt);
}

export const calendarEventSchema = calendarEventFieldsSchema
  .extend({
    id: calendarEventIdSchema,
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .strict()
  .refine(datesAreOrdered, {
    message: "Event end must be after its start.",
    path: ["endAt"],
  });

export const calendarEventCreateInputSchema = calendarEventFieldsSchema
  .strict()
  .refine(datesAreOrdered, {
    message: "Event end must be after its start.",
    path: ["endAt"],
  });

export const calendarEventUpdateInputSchema = calendarEventFieldsSchema
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one event field to update.",
  });

export const calendarEventListSchema = z.array(calendarEventSchema).max(300);

export type CalendarEvent = z.infer<typeof calendarEventSchema>;
export type CalendarEventCreateInput = z.input<
  typeof calendarEventCreateInputSchema
>;
export type CalendarEventUpdateInput = z.input<
  typeof calendarEventUpdateInputSchema
>;
