import {
  serviceFailure,
  serviceSuccess,
  type ServiceResult,
} from "@/lib/service-result";
import type {
  StorageIssue,
  StorageSource,
  VersionedStorage,
} from "@/lib/storage/versioned-storage";

export type LocalPersistence = {
  source: "fixtures" | StorageSource;
  warning?: StorageIssue;
};

export type LocalServiceData<T> = {
  persistence: LocalPersistence;
  value: T;
};

export type LocalCollection<T extends { id: string }> = {
  commit: (
    nextItems: readonly T[],
  ) => ServiceResult<LocalServiceData<readonly T[]>>;
  reset: () => ServiceResult<LocalServiceData<readonly T[]>>;
  snapshot: () => ServiceResult<LocalServiceData<readonly T[]>>;
};

type StorageAccess = {
  source: StorageSource;
  warning?: StorageIssue;
};

function cloneItems<T extends object>(
  items: readonly T[],
  cloneItem: (item: T) => T,
) {
  return items.map(cloneItem);
}

function persistenceFromStorage(access: StorageAccess): LocalPersistence {
  return access.warning
    ? { source: access.source, warning: access.warning }
    : { source: access.source };
}

function storageFailure<T>(result: {
  ok: false;
  error: {
    code: "INTERNAL" | "VALIDATION_FAILED";
    message: string;
    details: StorageIssue;
  };
}): ServiceResult<T> {
  return serviceFailure(
    result.error.code,
    result.error.message,
    result.error.details,
  );
}

export function createLocalCollection<T extends { id: string }>(options: {
  cloneItem?: (item: T) => T;
  fixtures: readonly T[];
  storage: VersionedStorage<T[]>;
}): LocalCollection<T> {
  const cloneItem = options.cloneItem ?? ((item: T) => ({ ...item }));
  let items = cloneItems(options.fixtures, cloneItem);
  let loaded = false;
  let persistence: LocalPersistence = { source: "fixtures" };

  function data(): LocalServiceData<readonly T[]> {
    return {
      persistence,
      value: cloneItems(items, cloneItem),
    };
  }

  function load(): ServiceResult<void> {
    if (loaded) return serviceSuccess(undefined);

    const stored = options.storage.read();
    if (!stored.ok) return storageFailure(stored);

    if (stored.data.found) {
      items = cloneItems(stored.data.value, cloneItem);
      persistence = persistenceFromStorage(stored.data);
    } else {
      items = cloneItems(options.fixtures, cloneItem);
      persistence = stored.data.warning
        ? persistenceFromStorage(stored.data)
        : { source: "fixtures" };
    }

    loaded = true;
    return serviceSuccess(undefined);
  }

  return {
    commit(nextItems) {
      const initialized = load();
      if (!initialized.ok) return initialized;

      const written = options.storage.write(cloneItems(nextItems, cloneItem));
      if (!written.ok) return storageFailure(written);

      items = cloneItems(written.data.value, cloneItem);
      persistence = persistenceFromStorage(written.data);
      return serviceSuccess(data());
    },
    reset() {
      const reset = options.storage.reset();
      items = cloneItems(options.fixtures, cloneItem);
      loaded = true;

      if (!reset.ok) {
        persistence = {
          source: "memory",
          warning: reset.error.details,
        };
        return storageFailure(reset);
      }

      persistence = { source: "fixtures" };
      return serviceSuccess(data());
    },
    snapshot() {
      const initialized = load();
      if (!initialized.ok) return initialized;
      return serviceSuccess(data());
    },
  };
}
