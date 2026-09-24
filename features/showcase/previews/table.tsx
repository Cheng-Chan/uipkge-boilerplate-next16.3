"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const rows = [
  { name: "Board", status: "Verified", files: 4 },
  { name: "Data Table", status: "Verified", files: 9 },
  { name: "Tree Table", status: "Verified", files: 3 },
];

export default function TablePreview() {
  const [descending, setDescending] = useState(false);
  const sorted = [...rows].sort((a, b) =>
    descending ? b.files - a.files : a.files - b.files,
  );

  return (
    <section className="border-border bg-card min-w-0 rounded-xl border p-5">
      <h2 className="font-semibold">Semantic table</h2>
      <div className="mt-4 overflow-x-auto">
        <Table aria-label="Component file counts">
          <TableCaption>Local catalogue component summary</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setDescending((value) => !value)}
                >
                  Files <ArrowUpDown className="size-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.files}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
