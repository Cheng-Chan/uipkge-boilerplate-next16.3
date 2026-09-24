"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineDescription,
  TimelineHeader,
  TimelineItem,
  TimelineMedia,
  TimelineTitle,
} from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";

const events = [
  {
    title: "Manifest audited",
    date: "September 24",
    status: "success" as const,
  },
  {
    title: "Preview implemented",
    date: "September 24",
    status: "current" as const,
  },
  { title: "Verification pending", date: "Next", status: "muted" as const },
];

export default function TimelinePreview() {
  const [compact, setCompact] = useState(false);

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Ticket timeline</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCompact((value) => !value)}
        >
          Toggle density
        </Button>
      </div>
      <Timeline className="mt-5" density={compact ? "compact" : "default"}>
        {events.map((event) => (
          <TimelineItem key={event.title} status={event.status}>
            <TimelineMedia
              status={event.status}
              variant="icon"
              coloredConnector
            >
              {event.status === "success" ? <Check className="size-3" /> : null}
            </TimelineMedia>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>{event.title}</TimelineTitle>
                <TimelineDate>{event.date}</TimelineDate>
              </TimelineHeader>
              <TimelineDescription>
                Synthetic local progress state.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}
