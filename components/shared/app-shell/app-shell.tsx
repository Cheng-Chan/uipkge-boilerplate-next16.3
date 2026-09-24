"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { AccountSwitcher } from "@/features/auth/account-switcher";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { navigationForRole, navigationItemForPath } from "@/config/navigation";
import { useDemoSession } from "@/features/auth/session/session-provider";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, state } = useDemoSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  if (state.status !== "authenticated") return children;

  const navigation = navigationForRole(state.identity.role);
  const currentItem = navigationItemForPath(pathname);
  const currentLabel =
    currentItem?.label ?? (pathname === "/403" ? "Access denied" : "Page");

  async function handleLogout() {
    const result = await logout();
    if (!result.ok) {
      setLogoutError(result.error.message);
      return;
    }
    router.replace("/");
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <a
        className="bg-primary text-primary-foreground focus-visible:ring-ring fixed top-2 left-2 z-[60] -translate-y-20 rounded-lg px-4 py-2 focus:translate-y-0 focus-visible:ring-2"
        href="#main-content"
      >
        Skip to content
      </a>

      <header className="border-border bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
        <aside
          aria-label="Demo security warning"
          className="border-warning/30 bg-warning/10 border-b px-4 py-2 text-center text-xs leading-5"
        >
          <strong>Demo only.</strong> Authentication, permissions, and data are
          simulated in your browser. Do not enter real credentials or sensitive
          information.
        </aside>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              aria-controls="application-navigation"
              aria-expanded={menuOpen}
              className="border-input rounded-lg border px-3 py-2 text-sm md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              Menu
            </button>
            <Link className="font-semibold tracking-tight" href="/dashboard">
              UIPKGE Lab
            </Link>
            <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs font-medium capitalize">
              {state.identity.role}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <details className="relative">
              <summary className="border-input cursor-pointer list-none rounded-lg border px-3 py-2 text-sm font-medium">
                {state.identity.displayName}
              </summary>
              <div className="border-border bg-popover text-popover-foreground absolute right-0 mt-2 w-72 space-y-4 rounded-xl border p-4 shadow-lg">
                <AccountSwitcher />
                <button
                  className="border-input w-full rounded-lg border px-3 py-2 text-sm font-medium"
                  onClick={() => void handleLogout()}
                  type="button"
                >
                  Log out
                </button>
                {logoutError ? (
                  <p className="text-destructive text-sm" role="alert">
                    {logoutError}
                  </p>
                ) : null}
              </div>
            </details>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl md:grid-cols-[15rem_minmax(0,1fr)]">
        <aside
          className={`${menuOpen ? "block" : "hidden"} border-border bg-card border-r p-4 md:block md:min-h-[calc(100vh-7.5rem)]`}
          id="application-navigation"
        >
          <nav aria-label="Application navigation">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const active = currentItem?.path === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                      href={item.path}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm">
            <ol className="text-muted-foreground flex items-center gap-2">
              <li>
                <Link className="hover:text-foreground" href="/dashboard">
                  Application
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground font-medium">
                {currentLabel}
              </li>
            </ol>
          </nav>
          <main id="main-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
