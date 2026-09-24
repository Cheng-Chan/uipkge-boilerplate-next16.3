"use client";

import { usePathname } from "next/navigation";

import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { matchRoutePolicy } from "@/features/access-control/policy";

export function GlobalThemeControl() {
  const pathname = usePathname();
  if (matchRoutePolicy(pathname)?.access === "authenticated") return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <ThemeSwitcher />
    </div>
  );
}
