"use client";

import { useState } from "react";
import { Attachment } from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";

const initialFiles = ["product-brief.pdf", "tokens.ts"];

export default function AttachmentPreview() {
  const [files, setFiles] = useState(initialFiles);

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <h2 className="font-semibold">Attachment states</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {files.map((file) => (
          <Attachment
            key={file}
            title={file}
            description={file.endsWith(".pdf") ? "1.2 MB" : "4 KB"}
            media={file.endsWith(".ts") ? "code" : "file"}
            removable
            onRemove={() =>
              setFiles((current) => current.filter((item) => item !== file))
            }
          />
        ))}
        <Attachment
          title="preview.png"
          description="Processing locally"
          media="image"
          state="processing"
        />
        <Attachment
          title="archive.zip"
          description="Upload failed"
          state="error"
        />
      </div>
      <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
        {files.length} removable attachments remain.
      </p>
      <Button
        className="mt-3"
        size="sm"
        variant="outline"
        onClick={() => setFiles(initialFiles)}
      >
        Reset attachments
      </Button>
    </section>
  );
}
