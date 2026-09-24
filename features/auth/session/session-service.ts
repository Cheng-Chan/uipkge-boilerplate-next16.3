import { z } from "zod";

import {
  demoIdentityReferenceSchema,
  type DemoIdentity,
  type DemoUserId,
} from "@/features/auth/types";
import {
  serviceFailure,
  serviceSuccess,
  type ServiceResult,
} from "@/lib/service-result";
import {
  createVersionedStorage,
  getBrowserSessionStorage,
  type StorageIssue,
  type StorageProvider,
  type StorageSource,
} from "@/lib/storage/versioned-storage";
import { DEMO_USERS } from "@/mocks/users";

export const demoSessionRecordSchema = demoIdentityReferenceSchema
  .extend({
    expiresAt: z.string().datetime({ offset: true }).optional(),
  })
  .strict();

export type DemoSessionRecord = z.infer<typeof demoSessionRecordSchema>;

export type SessionPersistence = {
  source: StorageSource;
  warning?: StorageIssue;
};

export type DemoSessionData = {
  identity: DemoIdentity | null;
  notice?: string;
  persistence: SessionPersistence;
};

export type DemoSessionService = {
  restore: () => Promise<ServiceResult<DemoSessionData>>;
  signIn: (
    userId: DemoUserId,
    expiresAt?: string,
  ) => Promise<ServiceResult<DemoSessionData>>;
  signOut: () => Promise<ServiceResult<DemoSessionData>>;
};

export type DemoSessionServiceOptions = {
  getStorage?: StorageProvider;
  now?: () => number;
};

function findIdentity(userId: DemoUserId) {
  return DEMO_USERS.find((identity) => identity.id === userId) ?? null;
}

function persistence(value: {
  source: StorageSource;
  warning?: StorageIssue;
}): SessionPersistence {
  return value.warning
    ? { source: value.source, warning: value.warning }
    : { source: value.source };
}

export function createDemoSessionService(
  options: DemoSessionServiceOptions = {},
): DemoSessionService {
  const now = options.now ?? Date.now;
  const storage = createVersionedStorage({
    name: "demo-session",
    version: 1,
    schema: demoSessionRecordSchema,
    getStorage: options.getStorage ?? getBrowserSessionStorage,
  });

  async function recoverToAnonymous(
    notice: string,
  ): Promise<ServiceResult<DemoSessionData>> {
    const reset = storage.reset();
    if (!reset.ok) {
      return serviceSuccess({
        identity: null,
        notice,
        persistence: { source: "memory", warning: reset.error.details },
      });
    }
    return serviceSuccess({
      identity: null,
      notice,
      persistence: persistence(reset.data),
    });
  }

  return {
    async restore() {
      const stored = storage.read();
      if (!stored.ok) {
        return recoverToAnonymous(
          "The saved demo session was invalid and has been cleared.",
        );
      }
      if (!stored.data.found) {
        return serviceSuccess({
          identity: null,
          persistence: persistence(stored.data),
        });
      }

      const identity = findIdentity(stored.data.value.userId);
      if (!identity) {
        return recoverToAnonymous(
          "The saved demo identity is no longer available and has been cleared.",
        );
      }
      if (
        stored.data.value.expiresAt &&
        Date.parse(stored.data.value.expiresAt) <= now()
      ) {
        return recoverToAnonymous(
          "The saved demo session expired and has been cleared.",
        );
      }
      return serviceSuccess({
        identity: { ...identity },
        persistence: persistence(stored.data),
      });
    },
    async signIn(userId, expiresAt) {
      const identity = findIdentity(userId);
      if (!identity) {
        return serviceFailure("NOT_FOUND", "Demo identity was not found.");
      }
      if (expiresAt && Date.parse(expiresAt) <= now()) {
        return serviceFailure(
          "VALIDATION_FAILED",
          "Demo session expiry must be in the future.",
        );
      }
      const written = storage.write(
        expiresAt ? { userId, expiresAt } : { userId },
      );
      if (!written.ok) return written;
      return serviceSuccess({
        identity: { ...identity },
        persistence: persistence(written.data),
      });
    },
    async signOut() {
      const reset = storage.reset();
      if (!reset.ok) return reset;
      return serviceSuccess({
        identity: null,
        persistence: persistence(reset.data),
      });
    },
  };
}
