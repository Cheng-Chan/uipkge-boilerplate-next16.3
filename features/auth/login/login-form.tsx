"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  authenticateDemoCredentials,
  loginInputSchema,
  resolveSafeNext,
  type LoginInput,
} from "@/features/auth/login/login-service";
import { useDemoSession } from "@/features/auth/session/session-provider";
import { PUBLIC_DEMO_CREDENTIALS } from "@/mocks/users";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, state } = useDemoSession();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<LoginInput>({
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = handleSubmit(async (input) => {
    clearErrors();
    const validated = loginInputSchema.safeParse(input);
    if (!validated.success) {
      for (const issue of validated.error.issues) {
        const field = issue.path[0];
        if (field === "username" || field === "password") {
          setError(field, { message: issue.message });
        }
      }
      return;
    }

    const authenticated = await authenticateDemoCredentials(validated.data);
    if (!authenticated.ok) {
      setError("root", { message: authenticated.error.message });
      return;
    }
    const started = await login(authenticated.data.id);
    if (!started.ok) {
      setError("root", { message: started.error.message });
      return;
    }
    router.replace(
      resolveSafeNext(searchParams.get("next"), authenticated.data.role),
    );
  });

  const pending = isSubmitting || state.status === "initializing";

  return (
    <div className="space-y-6">
      <aside
        aria-label="Demo security warning"
        className="border-warning/40 bg-warning/10 rounded-xl border p-4 text-sm leading-6"
      >
        <strong>Demo only.</strong> Authentication, permissions, and data are
        simulated in your browser. Do not enter real credentials or sensitive
        information.
      </aside>

      <form className="space-y-4" noValidate onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="username">
            Demo username
          </label>
          <input
            aria-describedby={errors.username ? "username-error" : undefined}
            aria-invalid={Boolean(errors.username)}
            autoComplete="username"
            className="border-input bg-background focus-visible:ring-ring w-full rounded-lg border px-3 py-2 outline-none focus-visible:ring-2"
            id="username"
            {...register("username")}
          />
          {errors.username ? (
            <p className="text-destructive text-sm" id="username-error">
              {errors.username.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Demo password
          </label>
          <div className="flex gap-2">
            <input
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={Boolean(errors.password)}
              autoComplete="current-password"
              className="border-input bg-background focus-visible:ring-ring min-w-0 flex-1 rounded-lg border px-3 py-2 outline-none focus-visible:ring-2"
              id="password"
              type={passwordVisible ? "text" : "password"}
              {...register("password")}
            />
            <button
              aria-label={passwordVisible ? "Hide password" : "Show password"}
              className="border-input rounded-lg border px-3 py-2 text-sm"
              onClick={() => setPasswordVisible((visible) => !visible)}
              type="button"
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password ? (
            <p className="text-destructive text-sm" id="password-error">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        {errors.root ? (
          <p className="text-destructive text-sm" role="alert">
            {errors.root.message}
          </p>
        ) : null}

        <button
          className="bg-primary text-primary-foreground focus-visible:ring-ring w-full rounded-lg px-4 py-2 font-medium outline-none focus-visible:ring-2 disabled:opacity-50"
          disabled={pending}
          type="submit"
        >
          {isSubmitting ? "Signing in locally…" : "Enter demo"}
        </button>
      </form>

      <section aria-labelledby="public-demo-accounts" className="space-y-3">
        <h2 className="font-medium" id="public-demo-accounts">
          Public demo accounts
        </h2>
        <p className="text-muted-foreground text-sm">
          These credentials are bundled test data, not secrets.
        </p>
        <ul className="space-y-2">
          {PUBLIC_DEMO_CREDENTIALS.map((credential) => (
            <li
              className="border-border flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm"
              key={credential.userId}
            >
              <span>
                <strong>{credential.username}</strong> / {credential.password}
              </span>
              <button
                className="text-primary underline underline-offset-4"
                onClick={() => {
                  setValue("username", credential.username);
                  setValue("password", credential.password);
                  clearErrors();
                }}
                type="button"
              >
                Use {credential.username}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-muted-foreground text-sm">
        Testing registration states?{" "}
        <Link
          className="text-primary underline underline-offset-4"
          href="/signup"
        >
          Open simulated sign-up
        </Link>
      </p>
    </div>
  );
}
