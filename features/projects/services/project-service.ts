import { CUSTOMER_FIXTURES } from "@/mocks/customers";
import { PROJECT_FIXTURES } from "@/mocks/projects";
import {
  projectCreateInputSchema,
  projectListSchema,
  projectSchema,
  projectUpdateInputSchema,
  type Project,
  type ProjectCreateInput,
  type ProjectUpdateInput,
} from "@/features/projects/schema";
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

const MUTATION_TIMESTAMP = "2026-01-15T12:00:00.000Z";
const fixtureCustomerIds = new Set<string>(
  CUSTOMER_FIXTURES.map(({ id }) => id),
);

export type ProjectService = {
  create: (
    input: ProjectCreateInput,
  ) => Promise<ServiceResult<LocalServiceData<Project>>>;
  delete: (id: string) => Promise<ServiceResult<LocalServiceData<Project>>>;
  getById: (id: string) => Promise<ServiceResult<LocalServiceData<Project>>>;
  list: () => Promise<ServiceResult<LocalServiceData<readonly Project[]>>>;
  reset: () => Promise<ServiceResult<LocalServiceData<readonly Project[]>>>;
  update: (
    id: string,
    input: ProjectUpdateInput,
  ) => Promise<ServiceResult<LocalServiceData<Project>>>;
};

export type ProjectServiceOptions = {
  customerExists?: (customerId: string) => boolean;
  getStorage?: StorageProvider;
};

function nextProjectId(projects: readonly Project[]) {
  let sequence = 1;
  while (projects.some(({ id }) => id === `project-local-${sequence}`)) {
    sequence += 1;
  }
  return `project-local-${sequence}`;
}

function entityResult<T>(
  value: T,
  persistence: LocalPersistence,
): ServiceResult<LocalServiceData<T>> {
  return serviceSuccess({ value, persistence });
}

export function createProjectService(
  options: ProjectServiceOptions = {},
): ProjectService {
  const customerExists =
    options.customerExists ?? ((id: string) => fixtureCustomerIds.has(id));
  const collection = createLocalCollection<Project>({
    fixtures: PROJECT_FIXTURES,
    storage: createVersionedStorage({
      name: "projects",
      version: 1,
      schema: projectListSchema,
      getStorage: options.getStorage,
    }),
  });

  function unknownCustomer() {
    return serviceFailure(
      "VALIDATION_FAILED",
      "Project customer is not available in this demo data set.",
      { issues: [{ path: "customerId", message: "Unknown customer ID." }] },
    );
  }

  return {
    async create(input) {
      const validated = projectCreateInputSchema.safeParse(input);
      if (!validated.success) {
        return validationFailure("Project input is invalid.", validated.error);
      }
      if (!customerExists(validated.data.customerId)) {
        return unknownCustomer();
      }

      const current = collection.snapshot();
      if (!current.ok) return current;

      const project = projectSchema.parse({
        ...validated.data,
        id: nextProjectId(current.data.value),
        createdAt: MUTATION_TIMESTAMP,
        updatedAt: MUTATION_TIMESTAMP,
      });
      const committed = collection.commit([...current.data.value, project]);
      if (!committed.ok) return committed;

      return entityResult(project, committed.data.persistence);
    },
    async delete(id) {
      const current = collection.snapshot();
      if (!current.ok) return current;

      const project = current.data.value.find((item) => item.id === id);
      if (!project) {
        return serviceFailure("NOT_FOUND", "Project was not found.");
      }

      const committed = collection.commit(
        current.data.value.filter((item) => item.id !== id),
      );
      if (!committed.ok) return committed;

      return entityResult(project, committed.data.persistence);
    },
    async getById(id) {
      const current = collection.snapshot();
      if (!current.ok) return current;

      const project = current.data.value.find((item) => item.id === id);
      return project
        ? entityResult(project, current.data.persistence)
        : serviceFailure("NOT_FOUND", "Project was not found.");
    },
    async list() {
      return collection.snapshot();
    },
    async reset() {
      return collection.reset();
    },
    async update(id, input) {
      const validated = projectUpdateInputSchema.safeParse(input);
      if (!validated.success) {
        return validationFailure("Project update is invalid.", validated.error);
      }
      if (
        validated.data.customerId &&
        !customerExists(validated.data.customerId)
      ) {
        return unknownCustomer();
      }

      const current = collection.snapshot();
      if (!current.ok) return current;

      const index = current.data.value.findIndex((item) => item.id === id);
      if (index < 0) {
        return serviceFailure("NOT_FOUND", "Project was not found.");
      }

      const merged = projectSchema.safeParse({
        ...current.data.value[index],
        ...validated.data,
        updatedAt: MUTATION_TIMESTAMP,
      });
      if (!merged.success) {
        return validationFailure("Project update is invalid.", merged.error);
      }

      const next = [...current.data.value];
      next[index] = merged.data;
      const committed = collection.commit(next);
      if (!committed.ok) return committed;

      return entityResult(merged.data, committed.data.persistence);
    },
  };
}
