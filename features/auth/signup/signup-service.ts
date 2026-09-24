import { z } from "zod";

import {
  serviceFailure,
  serviceSuccess,
  type ServiceResult,
} from "@/lib/service-result";

export const signupInputSchema = z
  .object({
    displayName: z.string().trim().min(2, "Enter a display name.").max(80),
    email: z.email("Enter a valid email-shaped demo value.").max(200),
    password: z
      .string()
      .min(8, "Use at least 8 characters for this form experiment.")
      .max(200),
  })
  .strict();

export type SignupInput = z.input<typeof signupInputSchema>;

export type SignupSimulation = {
  accountCreated: false;
  message: string;
};

export async function simulateSignup(
  input: SignupInput,
): Promise<ServiceResult<SignupSimulation>> {
  const validated = signupInputSchema.safeParse(input);
  if (!validated.success) {
    return serviceFailure(
      "VALIDATION_FAILED",
      "The simulated sign-up form is invalid.",
    );
  }
  return serviceSuccess({
    accountCreated: false,
    message:
      "Simulation complete. No real account was created, and the submitted password was not retained.",
  });
}
