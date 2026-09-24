"use client";

import { useState } from "react";

import { AreaChart } from "@/components/ui/charts/area-chart";
import { BarChart } from "@/components/ui/charts/bar-chart";
import { CategoryDistributionChart } from "@/components/ui/charts/category-distribution-chart";
import { PieChart } from "@/components/ui/charts/pie-chart";
import { SegmentedGauge } from "@/components/ui/charts/segmented-gauge";

const weeklyPipeline = [
  { period: "Mon", pipeline: 42, closed: 18 },
  { period: "Tue", pipeline: 54, closed: 24 },
  { period: "Wed", pipeline: 48, closed: 29 },
  { period: "Thu", pipeline: 67, closed: 31 },
  { period: "Fri", pipeline: 73, closed: 38 },
  { period: "Sat", pipeline: 61, closed: 34 },
  { period: "Sun", pipeline: 82, closed: 46 },
];

const monthlyPipeline = [
  { period: "Week 1", pipeline: 174, closed: 82 },
  { period: "Week 2", pipeline: 218, closed: 104 },
  { period: "Week 3", pipeline: 246, closed: 127 },
  { period: "Week 4", pipeline: 291, closed: 156 },
];

const acquisition = [
  { channel: "Organic", leads: 64 },
  { channel: "Partners", leads: 48 },
  { channel: "Paid", leads: 37 },
  { channel: "Events", leads: 29 },
];

const portfolio = [
  { name: "Platform", value: 46 },
  { name: "Mobile", value: 28 },
  { name: "Operations", value: 16 },
  { name: "Research", value: 10 },
];

export default function ChartsPreview() {
  const [range, setRange] = useState<"7 days" | "30 days">("7 days");
  const [stacked, setStacked] = useState(false);
  const pipeline = range === "7 days" ? weeklyPipeline : monthlyPipeline;

  return (
    <div className="space-y-8">
      <section className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Live bundle preview
            </p>
            <p className="mt-1 text-lg font-semibold">
              {range} · {stacked ? "stacked" : "overlaid"} series
            </p>
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Chart controls"
          >
            {(["7 days", "30 days"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={range === value}
                className="border-border data-[pressed=true]:bg-primary data-[pressed=true]:text-primary-foreground rounded-md border px-3 py-2 text-sm font-medium"
                data-pressed={range === value}
                onClick={() => setRange(value)}
              >
                {value}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={stacked}
              className="border-border data-[pressed=true]:bg-primary data-[pressed=true]:text-primary-foreground rounded-md border px-3 py-2 text-sm font-medium"
              data-pressed={stacked}
              onClick={() => setStacked((value) => !value)}
            >
              Stack series
            </button>
          </div>
        </div>
        <div className="mt-5">
          <AreaChart
            data={pipeline}
            xField="period"
            yField={["pipeline", "closed"]}
            markers
            stacked={stacked}
            height={320}
            ariaLabel={`Pipeline and closed revenue for ${range}`}
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Acquisition volume"
          description="Registry BarChart with value labels."
        >
          <BarChart
            data={acquisition}
            xField="channel"
            yField="leads"
            valueLabels
            height={280}
            ariaLabel="Acquisition leads by channel"
          />
        </ChartCard>

        <ChartCard
          title="Portfolio mix"
          description="Registry PieChart using its donut variant."
        >
          <PieChart
            data={portfolio}
            donut
            height={280}
            ariaLabel="Portfolio allocation by product"
          />
        </ChartCard>

        <ChartCard
          title="Service objective"
          description="Dependency-free SVG gauge from the same bundle."
        >
          <SegmentedGauge
            segments={[{ value: 72 }, { value: 18 }, { value: 10 }]}
            height={220}
            ariaLabel="Service objective distribution"
          >
            <span className="text-2xl font-semibold">99.95%</span>
            <span className="text-muted-foreground text-xs">availability</span>
          </SegmentedGauge>
        </ChartCard>

        <ChartCard
          title="Work allocation"
          description="Token-driven distribution without a canvas dependency."
        >
          <CategoryDistributionChart
            primaryValue="184"
            primaryLabel="active items"
            trend={{ value: "12%", direction: "up" }}
            categories={[
              { label: "Platform", percentage: 46 },
              { label: "Mobile", percentage: 28 },
              { label: "Operations", percentage: 16 },
              { label: "Research", percentage: 10 },
            ]}
            height={220}
            ariaLabel="Active work allocation by team"
          />
        </ChartCard>
      </div>

      <aside className="border-warning/30 bg-warning/10 rounded-xl border p-4 text-sm leading-6">
        <p className="font-semibold">External map boundary</p>
        <p className="text-muted-foreground mt-1">
          The live meta-bundle declares 62 chart dependencies. Its two
          Mapbox-backed wrappers are installed but intentionally not imported by
          this preview, so the default route needs no token and makes no map or
          tile request.
        </p>
      </aside>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border bg-card min-w-0 rounded-xl border p-5">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  );
}
