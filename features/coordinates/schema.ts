import { z } from "zod";

export const ILLUSTRATIVE_COORDINATE_NOTICE =
  "Illustrative local coordinates — not for navigation.";

export const coordinatePointSchema = z
  .object({
    latitude: z.number().finite().min(-90).max(90),
    longitude: z.number().finite().min(-180).max(180),
  })
  .strict();

export const coordinateFixtureSchema = z
  .object({
    id: z.string().regex(/^coordinate-[a-z0-9]+(?:-[a-z0-9]+)*$/),
    kind: z.enum(["marker", "polyline", "polygon"]),
    label: z.string().trim().min(2).max(100),
    description: z.string().trim().min(5).max(300),
    points: z.array(coordinatePointSchema).min(1).max(50),
    navigationNotice: z.literal(ILLUSTRATIVE_COORDINATE_NOTICE),
  })
  .strict()
  .superRefine((fixture, context) => {
    const minimum =
      fixture.kind === "marker" ? 1 : fixture.kind === "polyline" ? 2 : 3;
    const maximum = fixture.kind === "marker" ? 1 : 50;
    if (fixture.points.length < minimum || fixture.points.length > maximum) {
      context.addIssue({
        code: "custom",
        message: `${fixture.kind} requires ${minimum === maximum ? "exactly" : "at least"} ${minimum} point${minimum === 1 ? "" : "s"}.`,
        path: ["points"],
      });
    }
  });

export const coordinateFixtureListSchema = z
  .array(coordinateFixtureSchema)
  .max(100);

export type CoordinateFixture = z.infer<typeof coordinateFixtureSchema>;
