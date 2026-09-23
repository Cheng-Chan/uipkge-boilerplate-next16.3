import {
  ILLUSTRATIVE_COORDINATE_NOTICE,
  type CoordinateFixture,
} from "@/features/coordinates/schema";

export const COORDINATE_FIXTURES = [
  {
    id: "coordinate-demo-marker-a",
    kind: "marker",
    label: "Illustrative marker A",
    description: "A synthetic marker in an abstract local map plane.",
    points: [{ latitude: 12.5, longitude: 24.25 }],
    navigationNotice: ILLUSTRATIVE_COORDINATE_NOTICE,
  },
  {
    id: "coordinate-demo-route",
    kind: "polyline",
    label: "Illustrative sample line",
    description: "A fictional line for testing local map rendering only.",
    points: [
      { latitude: 10, longitude: 20 },
      { latitude: 11.5, longitude: 22 },
      { latitude: 13, longitude: 21 },
    ],
    navigationNotice: ILLUSTRATIVE_COORDINATE_NOTICE,
  },
  {
    id: "coordinate-demo-zone",
    kind: "polygon",
    label: "Illustrative sample zone",
    description: "A synthetic polygon that does not represent a real place.",
    points: [
      { latitude: 8, longitude: 18 },
      { latitude: 8, longitude: 19 },
      { latitude: 9, longitude: 19 },
      { latitude: 9, longitude: 18 },
    ],
    navigationNotice: ILLUSTRATIVE_COORDINATE_NOTICE,
  },
] as const satisfies readonly CoordinateFixture[];
