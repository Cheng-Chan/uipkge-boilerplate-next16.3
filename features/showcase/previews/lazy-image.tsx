"use client";

import { useState } from "react";
import { Img } from "@/components/ui/lazy-image";
import { Button } from "@/components/ui/button";

const localImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='640' height='360' fill='%232563eb'/%3E%3Ccircle cx='500' cy='80' r='140' fill='%2360a5fa'/%3E%3Cpath d='M0 300L180 130l130 120 95-90 235 200H0z' fill='%23dbeafe'/%3E%3C/svg%3E";

export default function LazyImagePreview() {
  const [broken, setBroken] = useState(false);

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <h2 className="font-semibold">Lazy image states</h2>
      <Img
        className="mt-4 w-full max-w-xl rounded-xl"
        src={broken ? "data:image/invalid," : localImage}
        alt="Abstract blue landscape"
        aspectRatio="16 / 9"
        eager
      />
      <Button
        className="mt-4"
        size="sm"
        variant="outline"
        onClick={() => setBroken((value) => !value)}
      >
        {broken ? "Restore image" : "Show fallback"}
      </Button>
    </section>
  );
}
