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

function cloneItems<T extends object>(items: readonly T[]) {
  return items.map((item) => ({ ...item }));
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
  fixtures: readonly T[];
  storage: VersionedStorage<T[]>;
}): LocalCollection<T> {
  let items = cloneItems(options.fixtures);
  let loaded = false;
  let persistence: LocalPersistence = { source: "fixtures" };

  function data(): LocalServiceData<readonly T[]> {
    return {
      persistence,
      value: cloneItems(items),
    };
  }

  function load(): ServiceResult<void> {
    if (loaded) return serviceSuccess(undefined);

    const stored = options.storage.read();
    if (!stored.ok) return storageFailure(stored);

    if (stored.data.found) {
      items = cloneItems(stored.data.value);
      persistence = persistenceFromStorage(stored.data);
    } else {
      items = cloneItems(options.fixtures);
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

      const written = options.storage.write(cloneItems(nextItems));
      if (!written.ok) return storageFailure(written);

      items = cloneItems(written.data.value);
      persistence = persistenceFromStorage(written.data);
      return serviceSuccess(data());
    },
    reset() {
      const reset = options.storage.reset();
      items = cloneItems(options.fixtures);
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
