import type { KpiMetric } from "@/features/kpis/schema";
import {
  serviceFailure,
  serviceSuccess,
  type ServiceResult,
} from "@/lib/service-result";
import { KPI_FIXTURES } from "@/mocks/kpis";

function cloneMetric(metric: KpiMetric): KpiMetric {
  return { ...metric, series: metric.series.map((point) => ({ ...point })) };
}

export type KpiService = {
  getById: (id: string) => Promise<ServiceResult<KpiMetric>>;
  list: () => Promise<ServiceResult<readonly KpiMetric[]>>;
};

export function createKpiService(): KpiService {
  return {
    async getById(id) {
      const metric = KPI_FIXTURES.find((item) => item.id === id);
      return metric
        ? serviceSuccess(cloneMetric(metric))
        : serviceFailure("NOT_FOUND", "KPI metric was not found.");
    },
    async list() {
      return serviceSuccess(KPI_FIXTURES.map(cloneMetric));
    },
  };
}
