import type { Activity } from "@/features/activity/schema";
import {
  serviceFailure,
  serviceSuccess,
  type ServiceResult,
} from "@/lib/service-result";
import { ACTIVITY_FIXTURES } from "@/mocks/activity";

export type ActivityService = {
  getById: (id: string) => Promise<ServiceResult<Activity>>;
  list: (projectId?: string) => Promise<ServiceResult<readonly Activity[]>>;
};

export function createActivityService(): ActivityService {
  return {
    async getById(id) {
      const activity = ACTIVITY_FIXTURES.find((item) => item.id === id);
      return activity
        ? serviceSuccess({ ...activity })
        : serviceFailure("NOT_FOUND", "Activity was not found.");
    },
    async list(projectId) {
      const activities = projectId
        ? ACTIVITY_FIXTURES.filter((item) => item.projectId === projectId)
        : ACTIVITY_FIXTURES;
      return serviceSuccess(activities.map((item) => ({ ...item })));
    },
  };
}
