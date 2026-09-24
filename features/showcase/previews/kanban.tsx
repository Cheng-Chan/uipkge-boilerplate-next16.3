"use client";

import { useState } from "react";
import {
  Kanban,
  KanbanBoard,
  KanbanCard,
  KanbanCardDescription,
  KanbanCardTitle,
  KanbanColumn,
  KanbanColumnBody,
  KanbanColumnCount,
  KanbanColumnHeader,
  KanbanColumnTitle,
  type KanbanMoveEvent,
} from "@/components/ui/kanban";

type Stage = "todo" | "doing" | "done";
type Card = { id: string; title: string; stage: Stage };
const stages: { id: Stage; label: string }[] = [
  { id: "todo", label: "To do" },
  { id: "doing", label: "In progress" },
  { id: "done", label: "Done" },
];
const initialCards: Card[] = [
  { id: "audit", title: "Audit manifest", stage: "todo" },
  { id: "preview", title: "Build preview", stage: "doing" },
  { id: "tests", title: "Run tests", stage: "done" },
];

export default function KanbanPreview() {
  const [cards, setCards] = useState(initialCards);
  const [lastMove, setLastMove] = useState("No card moved");

  function move({ cardId, toColumnId }: KanbanMoveEvent) {
    setCards((current) =>
      current.map((card) =>
        card.id === cardId ? { ...card, stage: toColumnId as Stage } : card,
      ),
    );
    setLastMove(`${cardId} moved to ${toColumnId}`);
  }

  return (
    <section className="border-border bg-card min-w-0 rounded-xl border p-5">
      <h2 className="font-semibold">Keyboard and pointer Kanban</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Focus a card, press Space, then use Left or Right.
      </p>
      <Kanban className="mt-5" onCardMove={move}>
        <KanbanBoard>
          {stages.map((stage) => {
            const stageCards = cards.filter((card) => card.stage === stage.id);
            return (
              <KanbanColumn
                key={stage.id}
                id={stage.id}
                label={stage.label}
                className="min-w-56"
              >
                <KanbanColumnHeader>
                  <KanbanColumnTitle>{stage.label}</KanbanColumnTitle>
                  <KanbanColumnCount count={stageCards.length} />
                </KanbanColumnHeader>
                <KanbanColumnBody>
                  {stageCards.map((card) => (
                    <KanbanCard key={card.id} id={card.id}>
                      <KanbanCardTitle>{card.title}</KanbanCardTitle>
                      <KanbanCardDescription>
                        Local demo card
                      </KanbanCardDescription>
                    </KanbanCard>
                  ))}
                </KanbanColumnBody>
              </KanbanColumn>
            );
          })}
        </KanbanBoard>
      </Kanban>
      <p className="text-muted-foreground mt-3 text-sm" aria-live="polite">
        {lastMove}
      </p>
    </section>
  );
}
