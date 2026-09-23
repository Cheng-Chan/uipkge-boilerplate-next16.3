import { DEMO_USERS } from "@/mocks/users";
import { PROJECT_FIXTURES } from "@/mocks/projects";
import { TASK_FIXTURES } from "@/mocks/tasks";
import {
  taskListSchema,
  taskMoveInputSchema,
  taskSchema,
  taskUpdateInputSchema,
  type Task,
  type TaskMoveInput,
  type TaskUpdateInput,
} from "@/features/tasks/schema";
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
const fixtureProjectIds = new Set<string>(PROJECT_FIXTURES.map(({ id }) => id));
const fixtureUserIds = new Set<string>(DEMO_USERS.map(({ id }) => id));

export type TaskService = {
  getById: (id: string) => Promise<ServiceResult<LocalServiceData<Task>>>;
  list: () => Promise<ServiceResult<LocalServiceData<readonly Task[]>>>;
  move: (
    id: string,
    input: TaskMoveInput,
  ) => Promise<ServiceResult<LocalServiceData<Task>>>;
  reset: () => Promise<ServiceResult<LocalServiceData<readonly Task[]>>>;
  update: (
    id: string,
    input: TaskUpdateInput,
  ) => Promise<ServiceResult<LocalServiceData<Task>>>;
};

export type TaskServiceOptions = {
  assigneeExists?: (userId: string) => boolean;
  getStorage?: StorageProvider;
  projectExists?: (projectId: string) => boolean;
};

function entityResult<T>(value: T, persistence: LocalPersistence) {
  return serviceSuccess({ value, persistence });
}

function unknownAssignee() {
  return serviceFailure(
    "VALIDATION_FAILED",
    "Task assignee is not available in this demo data set.",
    { issues: [{ path: "assigneeId", message: "Unknown demo user ID." }] },
  );
}

export function createTaskService(
  options: TaskServiceOptions = {},
): TaskService {
  const assigneeExists =
    options.assigneeExists ?? ((id: string) => fixtureUserIds.has(id));
  const collection = createLocalCollection<Task>({
    fixtures: TASK_FIXTURES,
    storage: createVersionedStorage({
      name: "tasks",
      version: 1,
      schema: taskListSchema,
      getStorage: options.getStorage,
    }),
  });
  const projectExists =
    options.projectExists ?? ((id: string) => fixtureProjectIds.has(id));

  return {
    async getById(id) {
      const current = collection.snapshot();
      if (!current.ok) return current;
      const task = current.data.value.find((item) => item.id === id);
      return task
        ? entityResult(task, current.data.persistence)
        : serviceFailure("NOT_FOUND", "Task was not found.");
    },
    async list() {
      return collection.snapshot();
    },
    async move(id, input) {
      const validated = taskMoveInputSchema.safeParse(input);
      if (!validated.success) {
        return validationFailure("Task move is invalid.", validated.error);
      }

      const current = collection.snapshot();
      if (!current.ok) return current;
      const task = current.data.value.find((item) => item.id === id);
      if (!task) return serviceFailure("NOT_FOUND", "Task was not found.");

      const targetTasks = current.data.value
        .filter(
          (item) => item.id !== id && item.status === validated.data.status,
        )
        .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
      if (validated.data.position > targetTasks.length) {
        return serviceFailure(
          "VALIDATION_FAILED",
          "Task move position is outside the target column.",
          {
            issues: [
              { path: "position", message: "Position is out of range." },
            ],
          },
        );
      }

      targetTasks.splice(validated.data.position, 0, {
        ...task,
        status: validated.data.status,
      });
      const targetById = new Map(
        targetTasks.map((item, position) => [
          item.id,
          taskSchema.parse({
            ...item,
            position,
            updatedAt: MUTATION_TIMESTAMP,
          }),
        ]),
      );
      const sourceTasks = current.data.value
        .filter(
          (item) =>
            item.id !== id &&
            item.status === task.status &&
            item.status !== validated.data.status,
        )
        .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
      const sourceById = new Map(
        sourceTasks.map((item, position) => [
          item.id,
          taskSchema.parse({ ...item, position }),
        ]),
      );
      const next = current.data.value.map(
        (item) => targetById.get(item.id) ?? sourceById.get(item.id) ?? item,
      );
      const committed = collection.commit(next);
      if (!committed.ok) return committed;
      return entityResult(
        targetById.get(id) as Task,
        committed.data.persistence,
      );
    },
    async reset() {
      return collection.reset();
    },
    async update(id, input) {
      const validated = taskUpdateInputSchema.safeParse(input);
      if (!validated.success) {
        return validationFailure("Task update is invalid.", validated.error);
      }
      if (
        validated.data.assigneeId &&
        !assigneeExists(validated.data.assigneeId)
      ) {
        return unknownAssignee();
      }

      const current = collection.snapshot();
      if (!current.ok) return current;
      const index = current.data.value.findIndex((item) => item.id === id);
      if (index < 0) return serviceFailure("NOT_FOUND", "Task was not found.");
      if (!projectExists(current.data.value[index].projectId)) {
        return serviceFailure(
          "VALIDATION_FAILED",
          "Task project is not available in this demo data set.",
        );
      }

      const task = taskSchema.parse({
        ...current.data.value[index],
        ...validated.data,
        updatedAt: MUTATION_TIMESTAMP,
      });
      const next = [...current.data.value];
      next[index] = task;
      const committed = collection.commit(next);
      if (!committed.ok) return committed;
      return entityResult(task, committed.data.persistence);
    },
  };
}
