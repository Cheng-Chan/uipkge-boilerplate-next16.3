import { describe, expect, it } from "vitest";

import { createCoordinateService } from "@/features/coordinates/services/coordinate-service";
import { createKpiService } from "@/features/kpis/services/kpi-service";
import { COORDINATE_FIXTURES } from "@/mocks/coordinates";
import { KPI_FIXTURES } from "@/mocks/kpis";

describe("KPI service", () => {
  it("lists cloned metrics and returns detail or NOT_FOUND", async () => {
    const service = createKpiService();
    const listed = await service.list();
    expect(listed).toEqual({ ok: true, data: KPI_FIXTURES });
    if (listed.ok) {
      expect(listed.data).not.toBe(KPI_FIXTURES);
      expect(listed.data[0].series).not.toBe(KPI_FIXTURES[0].series);
    }
    await expect(service.getById("kpi-demo-completion")).resolves.toMatchObject(
      {
        ok: true,
        data: { unit: "percent" },
      },
    );
    await expect(service.getById("kpi-missing")).resolves.toMatchObject({
      ok: false,
      error: { code: "NOT_FOUND" },
    });
  });
});

describe("coordinate service", () => {
  it("lists cloned fixtures and returns detail or NOT_FOUND", async () => {
    const service = createCoordinateService();
    const listed = await service.list();
    expect(listed).toEqual({ ok: true, data: COORDINATE_FIXTURES });
    if (listed.ok) {
      expect(listed.data).not.toBe(COORDINATE_FIXTURES);
      expect(listed.data[0].points).not.toBe(COORDINATE_FIXTURES[0].points);
    }
    await expect(
      service.getById("coordinate-demo-marker-a"),
    ).resolves.toMatchObject({ ok: true, data: { kind: "marker" } });
    await expect(service.getById("coordinate-missing")).resolves.toMatchObject({
      ok: false,
      error: { code: "NOT_FOUND" },
    });
  });
});
