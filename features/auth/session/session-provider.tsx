"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  permissionsForRole,
  type Permission,
} from "@/features/access-control/policy";
import type { DemoIdentity, DemoUserId } from "@/features/auth/types";
import {
  createDemoSessionService,
  type DemoSessionService,
  type SessionPersistence,
} from "@/features/auth/session/session-service";
import type { ServiceResult } from "@/lib/service-result";

export type DemoSessionState =
  | { status: "initializing" }
  | {
      status: "anonymous";
      notice?: string;
      persistence?: SessionPersistence;
    }
  | {
      status: "authenticated";
      identity: DemoIdentity;
      permissions: readonly Permission[];
      persistence: SessionPersistence;
    };

type DemoSessionContextValue = {
  login: (
    userId: DemoUserId,
    expiresAt?: string,
  ) => Promise<ServiceResult<DemoSessionState>>;
  logout: () => Promise<ServiceResult<DemoSessionState>>;
  state: DemoSessionState;
  switchIdentity: (
    userId: DemoUserId,
  ) => Promise<ServiceResult<DemoSessionState>>;
};

const DemoSessionContext = createContext<DemoSessionContextValue | null>(null);

function authenticatedState(
  identity: DemoIdentity,
  persistence: SessionPersistence,
): DemoSessionState {
  return {
    status: "authenticated",
    identity,
    permissions: permissionsForRole(identity.role),
    persistence,
  };
}

export function DemoSessionProvider({
  children,
  service,
}: {
  children: ReactNode;
  service?: DemoSessionService;
}) {
  const [sessionService] = useState(
    () => service ?? createDemoSessionService(),
  );
  const [state, setState] = useState<DemoSessionState>({
    status: "initializing",
  });

  useEffect(() => {
    let active = true;
    void sessionService.restore().then((result) => {
      if (!active) return;
      if (!result.ok || !result.data.identity) {
        setState({
          status: "anonymous",
          ...(result.ok && result.data.notice
            ? { notice: result.data.notice }
            : {}),
          ...(result.ok ? { persistence: result.data.persistence } : {}),
        });
        return;
      }
      setState(
        authenticatedState(result.data.identity, result.data.persistence),
      );
    });
    return () => {
      active = false;
    };
  }, [sessionService]);

  const login = useCallback(
    async (userId: DemoUserId, expiresAt?: string) => {
      const result = await sessionService.signIn(userId, expiresAt);
      if (!result.ok) return result;
      const nextState = result.data.identity
        ? authenticatedState(result.data.identity, result.data.persistence)
        : ({ status: "anonymous" } satisfies DemoSessionState);
      setState(nextState);
      return { ok: true, data: nextState } as const;
    },
    [sessionService],
  );

  const logout = useCallback(async () => {
    const result = await sessionService.signOut();
    const nextState = {
      status: "anonymous",
      ...(result.ok ? { persistence: result.data.persistence } : {}),
    } satisfies DemoSessionState;
    setState(nextState);
    return result.ok ? ({ ok: true, data: nextState } as const) : result;
  }, [sessionService]);

  const value = useMemo<DemoSessionContextValue>(
    () => ({ login, logout, state, switchIdentity: login }),
    [login, logout, state],
  );

  return (
    <DemoSessionContext.Provider value={value}>
      {children}
    </DemoSessionContext.Provider>
  );
}

export function useDemoSession() {
  const value = useContext(DemoSessionContext);
  if (!value) {
    throw new Error("useDemoSession must be used within DemoSessionProvider.");
  }
  return value;
}
