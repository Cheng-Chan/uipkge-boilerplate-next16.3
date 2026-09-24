import type { Metadata } from "next";

import { SignupForm } from "@/features/auth/signup/signup-form";

export const metadata: Metadata = {
  title: "Simulated sign-up | UIPKGE Boilerplate",
};

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-20">
      <section className="border-border bg-card text-card-foreground w-full space-y-6 rounded-2xl border p-6 shadow-sm sm:p-8">
        <div className="space-y-2">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            Form experiment
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Simulated sign-up
          </h1>
          <p className="text-muted-foreground">
            Exercise validation and completion states without provisioning an
            account.
          </p>
        </div>
        <SignupForm />
      </section>
    </main>
  );
}
