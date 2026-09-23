import {
  PUBLIC_DEMO_CREDENTIAL_LABEL,
  type DemoIdentity,
  type PublicDemoCredential,
} from "@/features/auth/types";

export const DEMO_USERS = [
  {
    id: "demo-user-admin",
    username: "demo-admin",
    displayName: "Demo Administrator",
    role: "admin",
  },
  {
    id: "demo-user-manager",
    username: "demo-manager",
    displayName: "Demo Manager",
    role: "manager",
  },
  {
    id: "demo-user-viewer",
    username: "demo-viewer",
    displayName: "Demo Viewer",
    role: "viewer",
  },
] as const satisfies readonly DemoIdentity[];

export const PUBLIC_DEMO_CREDENTIALS = [
  {
    kind: "public-demo-credential",
    label: PUBLIC_DEMO_CREDENTIAL_LABEL,
    userId: "demo-user-admin",
    username: "demo-admin",
    password: "demo-admin-password",
  },
  {
    kind: "public-demo-credential",
    label: PUBLIC_DEMO_CREDENTIAL_LABEL,
    userId: "demo-user-manager",
    username: "demo-manager",
    password: "demo-manager-password",
  },
  {
    kind: "public-demo-credential",
    label: PUBLIC_DEMO_CREDENTIAL_LABEL,
    userId: "demo-user-viewer",
    username: "demo-viewer",
    password: "demo-viewer-password",
  },
] as const satisfies readonly PublicDemoCredential[];
