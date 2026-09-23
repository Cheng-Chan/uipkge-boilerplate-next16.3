import {
  calendarEventCreateInputSchema,
  calendarEventListSchema,
  calendarEventSchema,
  calendarEventUpdateInputSchema,
  type CalendarEvent,
  type CalendarEventCreateInput,
  type CalendarEventUpdateInput,
} from "@/features/calendar/schema";
import {
  createLocalCollection,
  type LocalPersistence,
  type LocalServiceData,
} from "@/lib/local-collection";
import {
  serviceFailure,
  serviceSuccess,
  type ServiceResult,
} from "@/lib/service-result";
import {
  createVersionedStorage,
  type StorageProvider,
} from "@/lib/storage/versioned-storage";
import { validationFailure } from "@/lib/validation";
import { CALENDAR_EVENT_FIXTURES } from "@/mocks/calendar";
import { PROJECT_FIXTURES } from "@/mocks/projects";

const MUTATION_TIMESTAMP = "2026-01-15T12:00:00.000Z";
const fixtureProjectIds = new Set<string>(PROJECT_FIXTURES.map(({ id }) => id));

export type CalendarEventService = {
  create: (
    input: CalendarEventCreateInput,
  ) => Promise<ServiceResult<LocalServiceData<CalendarEvent>>>;
  delete: (
    id: string,
  ) => Promise<ServiceResult<LocalServiceData<CalendarEvent>>>;
  getById: (
    id: string,
  ) => Promise<ServiceResult<LocalServiceData<CalendarEvent>>>;
  list: () => Promise<
    ServiceResult<LocalServiceData<readonly CalendarEvent[]>>
  >;
  reset: () => Promise<
    ServiceResult<LocalServiceData<readonly CalendarEvent[]>>
  >;
  update: (
    id: string,
    input: CalendarEventUpdateInput,
  ) => Promise<ServiceResult<LocalServiceData<CalendarEvent>>>;
};

export type CalendarEventServiceOptions = {
  getStorage?: StorageProvider;
  projectExists?: (projectId: string) => boolean;
};

function nextEventId(events: readonly CalendarEvent[]) {
  let sequence = 1;
  while (events.some(({ id }) => id === `event-local-${sequence}`))
    sequence += 1;
  return `event-local-${sequence}`;
}

function entityResult<T>(value: T, persistence: LocalPersistence) {
  return serviceSuccess({ value, persistence });
}

function unknownProject() {
  return serviceFailure(
    "VALIDATION_FAILED",
    "Event project is not available in this demo data set.",
    { issues: [{ path: "projectId", message: "Unknown project ID." }] },
  );
}

export function createCalendarEventService(
  options: CalendarEventServiceOptions = {},
): CalendarEventService {
  const projectExists =
    options.projectExists ?? ((id: string) => fixtureProjectIds.has(id));
  const collection = createLocalCollection<CalendarEvent>({
    fixtures: CALENDAR_EVENT_FIXTURES,
    storage: createVersionedStorage({
      name: "calendar-events",
      version: 1,
      schema: calendarEventListSchema,
      getStorage: options.getStorage,
    }),
  });

  function projectIsValid(projectId: string | null) {
    return projectId === null || projectExists(projectId);
  }

  return {
    async create(input) {
      const validated = calendarEventCreateInputSchema.safeParse(input);
      if (!validated.success) {
        return validationFailure(
          "Calendar event input is invalid.",
          validated.error,
        );
      }
      if (!projectIsValid(validated.data.projectId)) return unknownProject();

      const current = collection.snapshot();
      if (!current.ok) return current;
      const event = calendarEventSchema.parse({
        ...validated.data,
        id: nextEventId(current.data.value),
        createdAt: MUTATION_TIMESTAMP,
        updatedAt: MUTATION_TIMESTAMP,
      });
      const committed = collection.commit([...current.data.value, event]);
      if (!committed.ok) return committed;
      return entityResult(event, committed.data.persistence);
    },
    async delete(id) {
      const current = collection.snapshot();
      if (!current.ok) return current;
      const event = current.data.value.find((item) => item.id === id);
      if (!event)
        return serviceFailure("NOT_FOUND", "Calendar event was not found.");
      const committed = collection.commit(
        current.data.value.filter((item) => item.id !== id),
      );
      if (!committed.ok) return committed;
      return entityResult(event, committed.data.persistence);
    },
    async getById(id) {
      const current = collection.snapshot();
      if (!current.ok) return current;
      const event = current.data.value.find((item) => item.id === id);
      return event
        ? entityResult(event, current.data.persistence)
        : serviceFailure("NOT_FOUND", "Calendar event was not found.");
    },
    async list() {
      return collection.snapshot();
    },
    async reset() {
      return collection.reset();
    },
    async update(id, input) {
      const validated = calendarEventUpdateInputSchema.safeParse(input);
      if (!validated.success) {
        return validationFailure(
          "Calendar event update is invalid.",
          validated.error,
        );
      }
      if (
        validated.data.projectId !== undefined &&
        !projectIsValid(validated.data.projectId)
      ) {
        return unknownProject();
      }

      const current = collection.snapshot();
      if (!current.ok) return current;
      const index = current.data.value.findIndex((item) => item.id === id);
      if (index < 0)
        return serviceFailure("NOT_FOUND", "Calendar event was not found.");
      const merged = calendarEventSchema.safeParse({
        ...current.data.value[index],
        ...validated.data,
        updatedAt: MUTATION_TIMESTAMP,
      });
      if (!merged.success) {
        return validationFailure(
          "Calendar event update is invalid.",
          merged.error,
        );
      }
      const next = [...current.data.value];
      next[index] = merged.data;
      const committed = collection.commit(next);
      if (!committed.ok) return committed;
      return entityResult(merged.data, committed.data.persistence);
    },
  };
}
