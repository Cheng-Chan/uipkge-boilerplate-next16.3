"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  signupInputSchema,
  simulateSignup,
  type SignupInput,
  type SignupSimulation,
} from "@/features/auth/signup/signup-service";

export function SignupForm() {
  const [result, setResult] = useState<SignupSimulation | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<SignupInput>({
    defaultValues: { displayName: "", email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (input) => {
    setResult(null);
    const validated = signupInputSchema.safeParse(input);
    if (!validated.success) {
      for (const issue of validated.error.issues) {
        const field = issue.path[0];
        if (
          field === "displayName" ||
          field === "email" ||
          field === "password"
        ) {
          setError(field, { message: issue.message });
        }
      }
      return;
    }
    const simulated = await simulateSignup(validated.data);
    if (simulated.ok) {
      setResult(simulated.data);
      reset({ displayName: "", email: "", password: "" });
    }
  });

  return (
    <div className="space-y-6">
      <aside
        aria-label="Demo security warning"
        className="border-warning/40 bg-warning/10 rounded-xl border p-4 text-sm leading-6"
      >
        <strong>Demo only.</strong> This form does not create an account, send
        email, or retain a password. Do not enter real credentials or sensitive
        information.
      </aside>

      <form className="space-y-4" noValidate onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="signup-name">
            Display name
          </label>
          <input
            aria-invalid={Boolean(errors.displayName)}
            className="border-input bg-background focus-visible:ring-ring w-full rounded-lg border px-3 py-2 outline-none focus-visible:ring-2"
            id="signup-name"
            {...register("displayName")}
          />
          {errors.displayName ? (
            <p className="text-destructive text-sm">
              {errors.displayName.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="signup-email">
            Demo email
          </label>
          <input
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className="border-input bg-background focus-visible:ring-ring w-full rounded-lg border px-3 py-2 outline-none focus-visible:ring-2"
            id="signup-email"
            type="email"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="signup-password">
            Experimental password
          </label>
          <input
            aria-invalid={Boolean(errors.password)}
            autoComplete="new-password"
            className="border-input bg-background focus-visible:ring-ring w-full rounded-lg border px-3 py-2 outline-none focus-visible:ring-2"
            id="signup-password"
            type="password"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-destructive text-sm">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <button
          className="bg-primary text-primary-foreground focus-visible:ring-ring w-full rounded-lg px-4 py-2 font-medium outline-none focus-visible:ring-2 disabled:opacity-50"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Simulating…" : "Simulate sign-up"}
        </button>
      </form>

      {result ? (
        <output
          className="border-success/40 bg-success/10 block rounded-xl border p-4 text-sm"
          role="status"
        >
          {result.message}
        </output>
      ) : null}

      <p className="text-muted-foreground text-sm">
        Use an existing public fixture instead?{" "}
        <Link
          className="text-primary underline underline-offset-4"
          href="/login"
        >
          Return to demo login
        </Link>
      </p>
    </div>
  );
}
