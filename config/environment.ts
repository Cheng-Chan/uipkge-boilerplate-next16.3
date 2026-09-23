import { z } from "zod";

function blankToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

const environmentSchema = z
  .object({
    NEXT_PUBLIC_MAPBOX_ENABLED: z
      .preprocess(blankToUndefined, z.enum(["true", "false"]).default("false"))
      .transform((value) => value === "true"),
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.preprocess(
      blankToUndefined,
      z
        .string()
        .trim()
        .startsWith(
          "pk.",
          "must be a browser-safe public token beginning with pk.",
        )
        .optional(),
    ),
  })
  .superRefine((environment, context) => {
    if (
      environment.NEXT_PUBLIC_MAPBOX_ENABLED &&
      !environment.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    ) {
      context.addIssue({
        code: "custom",
        message: "is required when NEXT_PUBLIC_MAPBOX_ENABLED is true",
        path: ["NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN"],
      });
    }

    if (
      !environment.NEXT_PUBLIC_MAPBOX_ENABLED &&
      environment.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    ) {
      context.addIssue({
        code: "custom",
        message:
          "requires NEXT_PUBLIC_MAPBOX_ENABLED=true; remove the token or enable the feature",
        path: ["NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN"],
      });
    }
  });

export type Environment = z.output<typeof environmentSchema>;

export function parseEnvironment(
  input: Readonly<Record<string, string | undefined>>,
): Environment {
  const result = environmentSchema.safeParse(input);

  if (result.success) return result.data;

  const details = result.error.issues
    .map(
      (issue) => `${issue.path.join(".") || "environment"}: ${issue.message}`,
    )
    .join("\n- ");

  throw new Error(`Invalid environment configuration:\n- ${details}`);
}
