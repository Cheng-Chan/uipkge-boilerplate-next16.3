"use client";

import { useState } from "react";

import { CataloguePreview } from "@/features/showcase/previews/preview-runtime";

type PreviewRevealProps = {
  itemId: string;
  title: string;
};

export function PreviewReveal({ itemId, title }: PreviewRevealProps) {
  const [open, setOpen] = useState(false);
  const previewId = `gallery-preview-${itemId}`;

  return (
    <div className="space-y-4">
      <button
        aria-controls={previewId}
        aria-expanded={open}
        className="border-input bg-background hover:bg-muted rounded-lg border px-3 py-2 text-sm font-semibold"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {open ? `Hide ${title} preview` : `Load ${title} preview`}
      </button>
      {open ? (
        <div
          className="border-border bg-background min-w-0 overflow-x-auto rounded-xl border p-4"
          id={previewId}
        >
          <CataloguePreview itemId={itemId} status="verified" />
        </div>
      ) : null}
    </div>
  );
}
