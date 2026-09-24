import type { Metadata } from "next";

import { AccessDenied } from "@/features/access-control/access-denied";

export const metadata: Metadata = {
  title: "Access denied | UIPKGE Boilerplate",
};

export default function ForbiddenPage() {
  return <AccessDenied />;
}
