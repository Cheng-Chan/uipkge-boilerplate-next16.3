"use client";

import { useState } from "react";
import { PaymentCard } from "@/components/ui/payment-card";
import { Button } from "@/components/ui/button";

export default function PaymentCardPreview() {
  const [flipped, setFlipped] = useState(false);

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <h2 className="font-semibold">Synthetic payment card</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Presentation only. The values are fixed test data and are never
        submitted.
      </p>
      <div className="mt-5 overflow-x-auto pb-3">
        <PaymentCard
          number="4242424242424242"
          name="DEMO USER"
          expiry="1230"
          cvc="123"
          flipped={flipped}
          tilt={false}
          shimmer
        />
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setFlipped((value) => !value)}
      >
        {flipped ? "Show front" : "Show back"}
      </Button>
      <p className="sr-only" aria-live="polite">
        Showing card {flipped ? "back" : "front"}
      </p>
    </section>
  );
}
