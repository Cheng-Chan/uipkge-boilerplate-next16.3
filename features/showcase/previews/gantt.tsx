"use client";

import { useState } from "react";
import {
  Gantt,
  GanttHeader,
  GanttTimeline,
  GanttTree,
  type GanttTask,
} from "@/components/ui/gantt";

const tasks: GanttTask[] = [
  {
    id: "research",
    name: "Research",
    startDate: "2026-09-21",
    endDate: "2026-09-24",
    progress: 100,
    status: "done",
    priority: "high",
    assignee: { name: "Alex Lee", initials: "AL" },
  },
  {
    id: "prototype",
    name: "Prototype",
    startDate: "2026-09-24",
    endDate: "2026-09-29",
    progress: 55,
    status: "in-progress",
    priority: "urgent",
    dependencies: ["research"],
    assignee: { name: "Blair Kim", initials: "BK" },
  },
  {
    id: "review",
    name: "Review",
    startDate: "2026-09-30",
    endDate: "2026-09-30",
    status: "todo",
    priority: "medium",
    isMilestone: true,
    dependencies: ["prototype"],
  },
];

export default function GanttPreview() {
  const [selected, setSelected] = useState("No task selected");

  return (
    <section className="border-border bg-card min-w-0 rounded-xl border p-5">
      <h2 className="font-semibold">Project schedule</h2>
      <div className="mt-4 overflow-x-auto pb-2">
        <Gantt
          className="min-w-[760px]"
          tasks={tasks}
          startDate="2026-09-20"
          endDate="2026-10-03"
          treeWidth={250}
          onTaskClick={(task) => setSelected(task.name)}
        >
          <GanttHeader title="Launch plan" />
          <div className="flex min-h-48">
            <GanttTree />
            <GanttTimeline showTodayLine />
          </div>
        </Gantt>
      </div>
      <p className="text-muted-foreground mt-3 text-sm" aria-live="polite">
        {selected}
      </p>
    </section>
  );
}
