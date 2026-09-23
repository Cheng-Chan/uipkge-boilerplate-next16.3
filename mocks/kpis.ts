import type { KpiMetric } from "@/features/kpis/schema";

export const KPI_FIXTURES = [
  {
    id: "kpi-demo-active-projects",
    label: "Active demo projects",
    unit: "count",
    currentValue: 2,
    changePercent: 0,
    series: [
      { date: "2025-09-01", value: 1 },
      { date: "2025-10-01", value: 2 },
      { date: "2025-11-01", value: 2 },
      { date: "2025-12-01", value: 2 },
    ],
    accessibleSummary:
      "Active fictional projects increased from one to two and remained at two.",
  },
  {
    id: "kpi-demo-completion",
    label: "Sample task completion",
    unit: "percent",
    currentValue: 20,
    changePercent: 5,
    series: [
      { date: "2025-09-01", value: 8 },
      { date: "2025-10-01", value: 12 },
      { date: "2025-11-01", value: 15 },
      { date: "2025-12-01", value: 20 },
    ],
    accessibleSummary:
      "Sample task completion rose from 8 percent to 20 percent across four months.",
  },
  {
    id: "kpi-demo-budget",
    label: "Illustrative active budget",
    unit: "usd-cents",
    currentValue: 5_120_000,
    changePercent: 4.2,
    series: [
      { date: "2025-09-01", value: 4_300_000 },
      { date: "2025-10-01", value: 4_600_000 },
      { date: "2025-11-01", value: 4_900_000 },
      { date: "2025-12-01", value: 5_120_000 },
    ],
    accessibleSummary:
      "Illustrative active budget rose from 43,000 to 51,200 US dollars; values are synthetic.",
  },
] as const satisfies readonly KpiMetric[];
