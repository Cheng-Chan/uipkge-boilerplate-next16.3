import type { Metadata } from "next";

import { catalogueSnapshot } from "@/catalogue/data";
import { LandingPage } from "@/features/landing/landing-page";

export const metadata: Metadata = {
  title: "UIPKGE component laboratory",
  description:
    "Explore an auditable, frontend-only UIPKGE React catalogue and static application laboratory.",
};

export default function HomePage() {
  return <LandingPage summary={catalogueSnapshot.summary} />;
}
