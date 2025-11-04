"use client";

import type { LanguageChartEntry } from "@/types";

type Props = {
  languages: LanguageChartEntry[];
};

export default function LanguageUsage({ languages }: Props) {
  if (!languages || languages.length === 0) return null;
  // Calculate total bytes for percentage calculation
  const totalBytes = languages.reduce((sum, lang) => sum + lang.value, 0);
  // Calculate percentages
  const languagesWithPercentage = languages.map((lang) => ({
    ...lang,
    percentage: totalBytes > 0 ? (lang.value / totalBytes) * 100 : 0,
  }));

  return (
    <section className="mt-4 flex flex-col gap-3">
      {/* Horizontal bar showing language distribution */}
      <div className="flex w-full h-2 rounded-full overflow-hidden">
        {languagesWithPercentage.map((lang) => (
          <div
            key={lang.name}
            className="h-full"
            style={{
              backgroundColor: lang.color || "#ccc",
              width: `${lang.percentage}%`,
            }}
            title={`${lang.name} ${lang.percentage.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Language list with percentages */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {languagesWithPercentage.map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: lang.color || "#ccc" }}
            />
            <span className="font-medium">{lang.name}</span>
            <span>{lang.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
