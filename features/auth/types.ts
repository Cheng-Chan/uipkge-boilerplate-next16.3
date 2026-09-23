import { z } from "zod";

export const DEMO_ROLES = ["admin", "manager", "viewer"] as const;
export const DEMO_USER_IDS = [
  "demo-user-admin",
  "demo-user-manager",
  "demo-user-viewer",
] as const;

export const PUBLIC_DEMO_CREDENTIAL_LABEL =
  "Public demo credential — not a secret.";

export const demoRoleSchema = z.enum(DEMO_ROLES);
export const demoUserIdSchema = z.enum(DEMO_USER_IDS);

export const demoIdentitySchema = z
  .object({
    id: demoUserIdSchema,
    username: z.string().regex(/^demo-[a-z]+$/),
    displayName: z.string().regex(/^Demo [A-Za-z]+$/),
    role: demoRoleSchema,
  })
  .strict();

export const demoIdentityReferenceSchema = z
  .object({
    userId: demoUserIdSchema,
  })
  .strict();

export const publicDemoCredentialSchema = z
  .object({
    kind: z.literal("public-demo-credential"),
    label: z.literal(PUBLIC_DEMO_CREDENTIAL_LABEL),
    userId: demoUserIdSchema,
    username: z.string().regex(/^demo-[a-z]+$/),
    password: z.string().regex(/^demo-[a-z]+-password$/),
  })
  .strict();

export type DemoIdentity = z.infer<typeof demoIdentitySchema>;
export type DemoIdentityReference = z.infer<typeof demoIdentityReferenceSchema>;
export type DemoRole = z.infer<typeof demoRoleSchema>;
export type DemoUserId = z.infer<typeof demoUserIdSchema>;
export type PublicDemoCredential = z.infer<typeof publicDemoCredentialSchema>;
