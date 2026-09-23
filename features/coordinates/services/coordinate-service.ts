import type { CoordinateFixture } from "@/features/coordinates/schema";
import {
  serviceFailure,
  serviceSuccess,
  type ServiceResult,
} from "@/lib/service-result";
import { COORDINATE_FIXTURES } from "@/mocks/coordinates";

function cloneFixture(fixture: CoordinateFixture): CoordinateFixture {
  return { ...fixture, points: fixture.points.map((point) => ({ ...point })) };
}

export type CoordinateService = {
  getById: (id: string) => Promise<ServiceResult<CoordinateFixture>>;
  list: () => Promise<ServiceResult<readonly CoordinateFixture[]>>;
};

export function createCoordinateService(): CoordinateService {
  return {
    async getById(id) {
      const fixture = COORDINATE_FIXTURES.find((item) => item.id === id);
      return fixture
        ? serviceSuccess(cloneFixture(fixture))
        : serviceFailure("NOT_FOUND", "Coordinate fixture was not found.");
    },
    async list() {
      return serviceSuccess(COORDINATE_FIXTURES.map(cloneFixture));
    },
  };
}
