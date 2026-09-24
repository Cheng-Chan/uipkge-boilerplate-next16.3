import { Check, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BadgePreview() {
  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <h2 className="font-semibold">Badge variants</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success">
          <Check aria-hidden="true" />
          Verified
        </Badge>
        <Badge variant="warning">Needs review</Badge>
        <Badge variant="destructive">Blocked</Badge>
        <Badge variant="info">
          <Info aria-hidden="true" />
          Information
        </Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
      <Badge className="mt-5 max-w-48" wrap variant="secondary">
        This intentionally long badge demonstrates wrapped content.
      </Badge>
    </section>
  );
}
