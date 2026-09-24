import type { Metadata } from "next";
import { Suspense } from "react";

import { catalogueSnapshot } from "@/catalogue/data";
import { CatalogueBrowser } from "@/features/showcase/catalogue/catalogue-browser";

export const metadata: Metadata = {
  title: "UI kit catalogue | UIPKGE Boilerplate",
};

export default function UiKitPage() {
  return (
    <Suspense
      fallback={
        <p className="text-muted-foreground" role="status">
          Loading catalogue filters…
        </p>
      }
    >
      <CatalogueBrowser
        items={catalogueSnapshot.items}
        summary={catalogueSnapshot.summary}
      />
    </Suspense>
  );
}
