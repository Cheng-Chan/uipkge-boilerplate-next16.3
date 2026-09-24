"use client";

import { useState } from "react";

import {
  Board,
  BoardCard,
  BoardLane,
  BoardLaneBody,
  BoardLaneEmpty,
  BoardLaneHeader,
} from "@/components/ui/board";

type LaneId = "backlog" | "active" | "done";
type WorkItem = { id: string; title: string; lane: LaneId };

const lanes: { id: LaneId; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "active", label: "In progress" },
  { id: "done", label: "Done" },
];

const initialItems: WorkItem[] = [
  { id: "brief", title: "Confirm project brief", lane: "backlog" },
  { id: "tokens", title: "Review design tokens", lane: "backlog" },
  { id: "preview", title: "Build component preview", lane: "active" },
  { id: "audit", title: "Run accessibility audit", lane: "done" },
];

export default function BoardPreview() {
  const [items, setItems] = useState(initialItems);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverLaneId, setDragOverLaneId] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState("No item moved");

  function moveItem(itemId: string | string[], toLaneId: string) {
    const ids = Array.isArray(itemId) ? itemId : [itemId];
    const destination = toLaneId as LaneId;
    setItems((current) =>
      current.map((item) =>
        ids.includes(item.id) ? { ...item, lane: destination } : item,
      ),
    );
    setLastMove(
      `${ids.length} item moved to ${lanes.find((lane) => lane.id === destination)?.label}`,
    );
  }

  return (
    <section className="border-border bg-card min-w-0 rounded-xl border p-5">
      <h2 className="font-semibold">Keyboard and pointer board</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Grab a focused card with Space, then use Left or Right. Pointer drag and
        drop is also enabled.
      </p>
      <Board
        aria-label="Project board"
        className="mt-5 grid gap-4 md:grid-cols-3"
        draggingId={draggingId}
        draggingIds={draggingId ? [draggingId] : []}
        dragOverLaneId={dragOverLaneId}
        moveItem={moveItem}
      >
        {lanes.map((lane) => {
          const laneItems = items.filter((item) => item.lane === lane.id);
          return (
            <BoardLane
              key={lane.id}
              id={lane.id}
              onLaneDragOver={(event) => {
                event.preventDefault();
                setDragOverLaneId(lane.id);
              }}
              onLaneDragLeave={() => setDragOverLaneId(null)}
              onLaneDrop={(event) => {
                event.preventDefault();
                if (draggingId) moveItem(draggingId, lane.id);
                setDraggingId(null);
                setDragOverLaneId(null);
              }}
            >
              <BoardLaneHeader>
                <h3 className="text-sm font-semibold">{lane.label}</h3>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {laneItems.length}
                </span>
              </BoardLaneHeader>
              <BoardLaneBody>
                {laneItems.map((item) => (
                  <BoardCard
                    key={item.id}
                    id={item.id}
                    aria-label={item.title}
                    selectable={false}
                    onDragStart={(event) => {
                      setDraggingId(item.id);
                      event.dataTransfer.setData("text/plain", item.id);
                    }}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDragOverLaneId(null);
                    }}
                  >
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Local demo task
                    </p>
                  </BoardCard>
                ))}
                <BoardLaneEmpty when={laneItems.length === 0}>
                  Drop an item here
                </BoardLaneEmpty>
              </BoardLaneBody>
            </BoardLane>
          );
        })}
      </Board>
      <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
        {lastMove}
      </p>
    </section>
  );
}
