import { describe, expect, it } from "vitest";

import { parseEnvironment } from "@/config/environment";

describe("parseEnvironment", () => {
  it("needs no configuration for the offline default", () => {
    expect(parseEnvironment({})).toEqual({
      NEXT_PUBLIC_MAPBOX_ENABLED: false,
    });
  });

  it("accepts an explicitly enabled public Mapbox token", () => {
    expect(
      parseEnvironment({
        NEXT_PUBLIC_MAPBOX_ENABLED: "true",
        NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: "pk.example-public-token",
      }),
    ).toEqual({
      NEXT_PUBLIC_MAPBOX_ENABLED: true,
      NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: "pk.example-public-token",
    });
  });

  it("treats blank values as the disabled default", () => {
    expect(
      parseEnvironment({
        NEXT_PUBLIC_MAPBOX_ENABLED: "",
        NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: "   ",
      }),
    ).toEqual({
      NEXT_PUBLIC_MAPBOX_ENABLED: false,
    });
  });

  it("rejects boolean-like values instead of guessing", () => {
    expect(() => parseEnvironment({ NEXT_PUBLIC_MAPBOX_ENABLED: "1" })).toThrow(
      /NEXT_PUBLIC_MAPBOX_ENABLED/,
    );
  });

  it("requires a public token when Mapbox is enabled", () => {
    expect(() =>
      parseEnvironment({ NEXT_PUBLIC_MAPBOX_ENABLED: "true" }),
    ).toThrow(
      /NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: is required when NEXT_PUBLIC_MAPBOX_ENABLED is true/,
    );
  });

  it("rejects a token unless Mapbox is explicitly enabled", () => {
    expect(() =>
      parseEnvironment({
        NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: "pk.example-public-token",
      }),
    ).toThrow(/requires NEXT_PUBLIC_MAPBOX_ENABLED=true/);
  });

  it("rejects secret Mapbox tokens without echoing their value", () => {
    const secretToken = "sk.do-not-print-this-value";

    expect(() =>
      parseEnvironment({
        NEXT_PUBLIC_MAPBOX_ENABLED: "true",
        NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: secretToken,
      }),
    ).toThrow(/browser-safe public token beginning with pk\./);

    try {
      parseEnvironment({
        NEXT_PUBLIC_MAPBOX_ENABLED: "true",
        NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: secretToken,
      });
    } catch (error) {
      expect(String(error)).not.toContain(secretToken);
    }
  });
});
