"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";
import {
  List,
  ListItem,
  ListItemActions,
  ListItemContent,
  ListItemDescription,
  ListItemMedia,
  ListItemTitle,
  ListSubheader,
} from "@/components/ui/list";

const items = [
  { id: "foundation", title: "Foundation", description: "Tokens and theme" },
  { id: "controls", title: "Controls", description: "Inputs and actions" },
  { id: "data", title: "Data display", description: "Tables and boards" },
];

export default function ListPreview() {
  const [active, setActive] = useState(items[0].id);

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <h2 className="font-semibold">Structured list</h2>
      <List className="mt-4">
        <ListSubheader>Catalogue sections</ListSubheader>
        {items.map((item) => (
          <ListItem
            key={item.id}
            active={active === item.id}
            onClick={() => setActive(item.id)}
          >
            <ListItemMedia>
              <CheckCircle2
                className="text-primary size-5"
                aria-hidden="true"
              />
            </ListItemMedia>
            <ListItemContent>
              <ListItemTitle>{item.title}</ListItemTitle>
              <ListItemDescription>{item.description}</ListItemDescription>
            </ListItemContent>
            <ListItemActions>
              <ChevronRight className="size-4" aria-hidden="true" />
            </ListItemActions>
          </ListItem>
        ))}
      </List>
      <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
        Selected: {active}
      </p>
    </section>
  );
}
