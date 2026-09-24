"use client";

import { useState } from "react";
import { QrCode, type QRCodeStatus } from "@/components/ui/qr-code";
import { Button } from "@/components/ui/button";

export default function QrCodePreview() {
  const [status, setStatus] = useState<QRCodeStatus>("active");

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <h2 className="font-semibold">Locally generated QR code</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Encodes a reserved .invalid address without contacting it.
      </p>
      <div className="mt-5">
        <QrCode
          value="https://demo.invalid/catalogue/CAT009"
          type="svg"
          status={status}
          size={180}
          onRefresh={() => setStatus("active")}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {(["active", "loading", "scanned", "expired"] as const).map((value) => (
          <Button
            key={value}
            size="sm"
            variant={status === value ? "default" : "outline"}
            onClick={() => setStatus(value)}
          >
            {value}
          </Button>
        ))}
      </div>
    </section>
  );
}
