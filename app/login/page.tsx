import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/features/auth/login/login-form";

export const metadata: Metadata = {
  title: "Demo login | UIPKGE Boilerplate",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-20">
      <section className="border-border bg-card text-card-foreground w-full space-y-6 rounded-2xl border p-6 shadow-sm sm:p-8">
        <div className="space-y-2">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            Local browser simulation
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Demo login</h1>
          <p className="text-muted-foreground">
            Choose a public fixture account to inspect role-specific UI states.
          </p>
        </div>
        <Suspense fallback={<p>Preparing the local login form…</p>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
