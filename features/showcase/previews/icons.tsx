"use client";

import { useState } from "react";
import { ArrowRight, Heart, Settings } from "lucide-react";
import { Icon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

export default function IconsPreview() {
  const [rotation, setRotation] = useState(0);

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <h2 className="font-semibold">Universal icon wrapper</h2>
      <div className="mt-5 flex items-center gap-6">
        <Icon label="Favorite" size="lg" color="var(--destructive)">
          <Heart className="size-full" />
        </Icon>
        <Icon label="Settings" size="xl">
          <Settings className="size-full" />
        </Icon>
        <Icon label="Direction" size="2xl" rotation={rotation}>
          <ArrowRight className="size-full" />
        </Icon>
      </div>
      <Button
        className="mt-5"
        size="sm"
        variant="outline"
        onClick={() => setRotation((value) => value + 90)}
      >
        Rotate direction
      </Button>
      <p className="text-muted-foreground mt-2 text-sm" aria-live="polite">
        Rotation: {rotation % 360} degrees
      </p>
    </section>
  );
}
