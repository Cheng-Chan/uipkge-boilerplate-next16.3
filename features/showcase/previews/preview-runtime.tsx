"use client";

import { Component, Suspense, type ReactNode } from "react";

import { PREVIEW_COMPONENTS, type LazyPreview } from "./preview-loaders";

type PreviewErrorBoundaryProps = {
  children: ReactNode;
};

class PreviewErrorBoundary extends Component<
  PreviewErrorBoundaryProps,
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          className="border-destructive/40 bg-destructive/5 rounded-xl border p-5"
          role="alert"
        >
          <h2 className="font-semibold">This preview could not load</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            The failure is contained to this item. Other catalogue routes remain
            available.
          </p>
          <p className="text-muted-foreground mt-3 text-sm">
            Reload this item route after resolving the module or dependency
            error.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function PreviewRuntime({ preview: Preview }: { preview: LazyPreview }) {
  return (
    <PreviewErrorBoundary>
      <Suspense
        fallback={
          <p className="text-muted-foreground" role="status">
            Loading isolated preview…
          </p>
        }
      >
        <section className="isolate" data-preview-isolation="true">
          <Preview />
        </section>
      </Suspense>
    </PreviewErrorBoundary>
  );
}

export function CataloguePreview({
  itemId,
  status,
}: {
  itemId: string;
  status: string;
}) {
  const Preview = (PREVIEW_COMPONENTS as Record<string, LazyPreview>)[itemId];
  if (!Preview) {
    return (
      <section
        className="border-border bg-muted/30 rounded-xl border border-dashed p-6"
        data-preview-unavailable="true"
      >
        <h2 className="font-semibold">Preview not installed</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
          This item is currently {status}. Its record and route are available
          for inspection, but LAB04 does not substitute a placeholder for the
          real registry implementation. An exact CAT ticket must install, adapt,
          exercise, and evidence it first.
        </p>
      </section>
    );
  }
  return <PreviewRuntime preview={Preview} />;
}
