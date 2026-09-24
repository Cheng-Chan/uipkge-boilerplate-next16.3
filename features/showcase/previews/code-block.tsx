"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";

const snippets = {
  tsx: `export function Greeting({ name }: { name: string }) {\n  return <p>Hello, {name}!</p>;\n}`,
  css: `.card {\n  border-radius: 0.75rem;\n  padding: 1rem;\n}`,
};

export default function CodeBlockPreview() {
  const [language, setLanguage] = useState<keyof typeof snippets>("tsx");

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">Highlighted source</h2>
        <div className="flex gap-2">
          {Object.keys(snippets).map((key) => (
            <Button
              key={key}
              size="sm"
              variant={language === key ? "default" : "outline"}
              onClick={() => setLanguage(key as keyof typeof snippets)}
            >
              {key.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
      <CodeBlock
        className="mt-4"
        code={snippets[language]}
        language={language}
        maxHeight="240px"
      />
    </section>
  );
}
