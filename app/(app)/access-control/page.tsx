import type { Metadata } from "next";

import { AccessControlInspector } from "@/features/access-control/access-control-inspector";

export const metadata: Metadata = {
  title: "Demo access control | UIPKGE Boilerplate",
};

export default function AccessControlPage() {
  return <AccessControlInspector />;
}
