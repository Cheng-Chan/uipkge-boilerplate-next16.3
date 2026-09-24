import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CategoryDistributionChart } from "@/components/ui/charts/category-distribution-chart";
import { SegmentedGauge } from "@/components/ui/charts/segmented-gauge";
import { heightToStyle } from "@/components/ui/charts/shared";
import {
  mergeOptionBlock,
  toCanvasColor,
  toRgba,
} from "@/components/ui/charts/useChartTheme";

describe("CAT002 chart foundation", () => {
  it("renders accessible dependency-free chart variants", () => {
    render(
      <>
        <SegmentedGauge
          segments={[{ value: 70 }, { value: 30 }]}
          ariaLabel="Availability split"
        >
          <span>99.95%</span>
        </SegmentedGauge>
        <CategoryDistributionChart
          primaryValue="100"
          categories={[
            { label: "Platform", percentage: 3 },
            { label: "Mobile", percentage: 1 },
          ]}
          ariaLabel="Work allocation"
        />
      </>,
    );

    expect(
      screen.getByRole("img", { name: "Availability split" }),
    ).toBeVisible();
    expect(screen.getByRole("img", { name: "Work allocation" })).toBeVisible();
    expect(screen.getByTitle("Platform — 75%")).toBeInTheDocument();
    expect(screen.getByTitle("Mobile — 25%")).toBeInTheDocument();
  });

  it("normalizes heights, colors, and nested option overrides", () => {
    expect(heightToStyle(320)).toBe("320px");
    expect(heightToStyle("20rem")).toBe("20rem");
    expect(toCanvasColor("oklch(0.65 0.20 145)")).toMatch(/^rgb\(/);
    expect(toRgba("oklch(0.65 0.20 145)", 0.4)).toMatch(
      /^rgba\(\d+, \d+, \d+,0\.4\)$/,
    );
    expect(
      mergeOptionBlock(
        { axisLabel: { color: "red", fontSize: 11 }, show: true },
        { axisLabel: { fontSize: 9 } },
      ),
    ).toEqual({ axisLabel: { color: "red", fontSize: 9 }, show: true });
  });
});
