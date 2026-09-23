import { z } from "zod";

export const kpiMetricIdSchema = z
  .string()
  .regex(/^kpi-[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const kpiPointSchema = z
  .object({
    date: z.iso.date(),
    value: z.number().finite(),
  })
  .strict();

export const kpiMetricSchema = z
  .object({
    id: kpiMetricIdSchema,
    label: z.string().trim().min(2).max(80),
    unit: z.enum(["count", "percent", "usd-cents"]),
    currentValue: z.number().finite(),
    changePercent: z.number().finite().min(-1_000).max(1_000),
    series: z.array(kpiPointSchema).min(2).max(100),
    accessibleSummary: z.string().trim().min(10).max(300),
  })
  .strict()
  .refine(
    (metric) =>
      metric.series.every(
        (point, index) =>
          index === 0 || point.date > metric.series[index - 1].date,
      ),
    { message: "KPI dates must be unique and ascending.", path: ["series"] },
  );

export const kpiMetricListSchema = z.array(kpiMetricSchema).max(50);

export type KpiMetric = z.infer<typeof kpiMetricSchema>;
