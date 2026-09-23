import { describe, expect, it } from "vitest";

import {
  coordinateFixtureListSchema,
  ILLUSTRATIVE_COORDINATE_NOTICE,
} from "@/features/coordinates/schema";
import { kpiMetricListSchema } from "@/features/kpis/schema";
import {
  LOCAL_MESSAGE_NOTICE,
  messageThreadListSchema,
} from "@/features/messages/schema";
import { COORDINATE_FIXTURES } from "@/mocks/coordinates";
import { KPI_FIXTURES } from "@/mocks/kpis";
import { MESSAGE_THREAD_FIXTURES } from "@/mocks/messages";

describe("message, KPI, and coordinate fixtures", () => {
  it("validates synthetic local-only message threads", () => {
    const threads = messageThreadListSchema.parse(MESSAGE_THREAD_FIXTURES);
    expect(threads).toHaveLength(2);
    const messages = threads.flatMap((thread) => thread.messages);
    expect(
      messages.every((message) => message.delivery === "local-simulation"),
    ).toBe(true);
    expect(
      messages.every(
        (message) => message.deliveryNotice === LOCAL_MESSAGE_NOTICE,
      ),
    ).toBe(true);
    expect(new Set(messages.map(({ id }) => id)).size).toBe(messages.length);
    expect(
      messageThreadListSchema.safeParse([
        {
          ...threads[0],
          messages: [
            { ...threads[0].messages[0], authorId: "demo-user-viewer" },
          ],
        },
      ]).success,
    ).toBe(false);
  });

  it("validates deterministic ascending KPI series and summaries", () => {
    expect(kpiMetricListSchema.parse(KPI_FIXTURES)).toHaveLength(3);
    expect(
      KPI_FIXTURES.every((metric) => metric.accessibleSummary.length >= 10),
    ).toBe(true);
    expect(
      kpiMetricListSchema.safeParse([
        {
          ...KPI_FIXTURES[0],
          series: [...KPI_FIXTURES[0].series].reverse(),
        },
      ]).success,
    ).toBe(false);
  });

  it("validates bounded illustrative coordinates with non-navigation labels", () => {
    expect(coordinateFixtureListSchema.parse(COORDINATE_FIXTURES)).toHaveLength(
      3,
    );
    expect(
      COORDINATE_FIXTURES.every(
        ({ navigationNotice }) =>
          navigationNotice === ILLUSTRATIVE_COORDINATE_NOTICE,
      ),
    ).toBe(true);
    expect(COORDINATE_FIXTURES.map(({ kind }) => kind)).toEqual([
      "marker",
      "polyline",
      "polygon",
    ]);
    expect(
      coordinateFixtureListSchema.safeParse([
        {
          ...COORDINATE_FIXTURES[0],
          points: [
            ...COORDINATE_FIXTURES[0].points,
            { latitude: 13, longitude: 25 },
          ],
        },
      ]).success,
    ).toBe(false);
  });
});
