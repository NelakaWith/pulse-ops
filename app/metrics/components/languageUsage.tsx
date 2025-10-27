"use client";
import { useMemo } from "react";
import { PieChart, Pie, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { LanguageUsageProps } from "../types";

const chartConfig = {
  usage: {
    label: "Language Usage",
  },
} satisfies ChartConfig;

function LanguageUsage({ repositories }: LanguageUsageProps) {
  const chartData = useMemo(() => {
    if (!repositories?.nodes) return [];

    // Aggregate language usage across all repositories
    const languageMap = new Map<string, { size: number; color: string }>();

    repositories.nodes.forEach((repo) => {
      repo.languages.edges.forEach((edge) => {
        const { name, color } = edge.node;
        const size = edge.size;

        if (languageMap.has(name)) {
          const existing = languageMap.get(name)!;
          languageMap.set(name, {
            size: existing.size + size,
            color: existing.color,
          });
        } else {
          languageMap.set(name, { size, color });
        }
      });
    });

    // Convert to array and sort by size
    const languageArray = Array.from(languageMap.entries())
      .map(([name, { size, color }]) => ({
        name,
        value: size,
        color,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 languages

    return languageArray;
  }, [repositories]);

  if (!repositories?.nodes || chartData.length === 0) {
    return (
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Language Usage</h3>
        <p className="text-sm text-muted-foreground">
          No language data available
        </p>
      </div>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          <span className="text-xl">Language Usage</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => {
                const percentage = (
                  (value /
                    chartData.reduce((sum, item) => sum + item.value, 0)) *
                  100
                ).toFixed(1);
                return `${name} (${percentage}%)`;
              }}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              formatter={(value: number, name: string) => [
                `${(
                  (value /
                    chartData.reduce((sum, item) => sum + item.value, 0)) *
                  100
                ).toFixed(1)}%`,
                name,
              ]}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default LanguageUsage;
