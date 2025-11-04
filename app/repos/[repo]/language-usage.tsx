"use client";

import React from "react";
import type { LanguageChartEntry } from "@/types";

type Props = {
  languages: LanguageChartEntry[];
};

export default function LanguageUsage({ languages }: Props) {
  if (!languages || languages.length === 0) return null;

  return (
    <section className="mt-4 flex flex-col gap-2">
      {languages.map((l) => (
        <div
          key={l.name}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: l.color || "#ccc" }}
          />
          <span>
            {l.name}
            {l.value ? ` — ${l.value} bytes` : ""}
          </span>
        </div>
      ))}
    </section>
  );
}
