import type { Metadata } from "next";

import { catalogueSnapshot } from "@/catalogue/data";
import { VerifiedGallery } from "@/features/showcase/gallery/verified-gallery";

export const metadata: Metadata = {
  title: "Live component gallery | UIPKGE Boilerplate",
  description:
    "Interact with every verified UIPKGE component through isolated, lazy-loaded previews.",
};

export default function UiKitGalleryPage() {
  const verifiedItems = catalogueSnapshot.items.filter(
    (item) => item.scope === "catalogue" && item.status === "verified",
  );

  return <VerifiedGallery items={verifiedItems} />;
}
