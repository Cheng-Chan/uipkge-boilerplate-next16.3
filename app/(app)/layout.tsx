import type { ReactNode } from "react";

import { AppShell } from "@/components/shared/app-shell/app-shell";
import { RouteGuard } from "@/features/access-control/route-guard";

export default function ProtectedApplicationLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <RouteGuard>
      <AppShell>{children}</AppShell>
    </RouteGuard>
  );
}
