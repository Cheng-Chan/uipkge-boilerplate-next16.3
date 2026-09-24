import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";

const people = ["AL", "BK", "CM", "DR"];

export default function AvatarPreview() {
  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <h2 className="font-semibold">Avatar sizes and groups</h2>
      <div className="mt-4 flex flex-wrap items-end gap-4">
        {(["xs", "sm", "default", "lg", "xl"] as const).map((size, index) => (
          <Avatar
            key={size}
            size={size}
            variant={index % 2 ? "outlined" : "soft"}
            color="primary"
          >
            <AvatarFallback
              size={size}
              color="primary"
              text={people[index % people.length]}
            />
          </Avatar>
        ))}
      </div>
      <AvatarGroup
        className="mt-6"
        max={3}
        total={7}
        size="lg"
        aria-label="Project contributors"
      >
        {people.map((initials) => (
          <Avatar key={initials} size="lg">
            <AvatarFallback size="lg" text={initials} />
          </Avatar>
        ))}
      </AvatarGroup>
    </section>
  );
}
