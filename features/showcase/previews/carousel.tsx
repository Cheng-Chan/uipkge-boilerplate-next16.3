"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselIndicators,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const slides = [
  ["Discover", "Browse the component catalogue."],
  ["Compose", "Combine primitives into local demos."],
  ["Verify", "Exercise keyboard and pointer behavior."],
] as const;

export default function CarouselPreview() {
  const [current, setCurrent] = useState(1);

  function connect(api: CarouselApi) {
    if (!api) return;
    const update = () => setCurrent(api.selectedScrollSnap() + 1);
    update();
    api.on("select", update);
  }

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <h2 className="font-semibold">Keyboard carousel</h2>
      <p className="text-muted-foreground mt-1 text-sm" aria-live="polite">
        Slide {current} of {slides.length}
      </p>
      <Carousel
        className="mx-auto mt-5 max-w-xl"
        opts={{ loop: true }}
        setApi={connect}
      >
        <CarouselContent>
          {slides.map(([title, description], index) => (
            <CarouselItem
              key={title}
              aria-label={`${index + 1} of ${slides.length}`}
            >
              <div className="bg-muted/40 flex min-h-48 flex-col items-center justify-center rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  {description}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3" />
        <CarouselNext className="right-3" />
        <CarouselIndicators className="mt-3" />
      </Carousel>
    </section>
  );
}
