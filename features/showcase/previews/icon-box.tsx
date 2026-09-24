import { Bell, ShieldCheck, Sparkles } from "lucide-react";
import { IconBox, IconStack } from "@/components/ui/icon-box";

export default function IconBoxPreview() {
  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <h2 className="font-semibold">Icon containers</h2>
      <div className="mt-5 flex flex-wrap items-center gap-5">
        <IconBox
          icon={Bell}
          size="sm"
          variant="muted"
          aria-label="Notifications"
        />
        <IconBox
          icon={ShieldCheck}
          size="lg"
          shape="circle"
          variant="success"
          aria-label="Verified"
        />
        <IconBox
          icon={Sparkles}
          size="xl"
          shape="square"
          variant="warning"
          aria-label="Highlights"
        />
        <IconStack
          icon={ShieldCheck}
          variant="primary"
          size="lg"
          aria-label="Security stack"
        />
      </div>
    </section>
  );
}
