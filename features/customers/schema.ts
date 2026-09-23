import { z } from "zod";

export const customerStatusSchema = z.enum(["active", "prospect", "inactive"]);

export const customerIdSchema = z
  .string()
  .regex(/^customer-[a-z0-9]+(?:-[a-z0-9]+)*$/);

const customerFieldsSchema = z.object({
  name: z.string().trim().min(2).max(80),
  contactName: z.string().trim().min(2).max(80),
  contactEmail: z.string().trim().email().max(120),
  status: customerStatusSchema,
});

export const customerSchema = customerFieldsSchema
  .extend({
    id: customerIdSchema,
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export const customerCreateInputSchema = customerFieldsSchema.strict();

export const customerUpdateInputSchema = customerFieldsSchema
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one customer field to update.",
  });

export const customerListSchema = z.array(customerSchema).max(100);

export type Customer = z.infer<typeof customerSchema>;
export type CustomerCreateInput = z.input<typeof customerCreateInputSchema>;
export type CustomerUpdateInput = z.input<typeof customerUpdateInputSchema>;
