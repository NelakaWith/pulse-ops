"use client";
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { ContributionChartProps } from "../types";

const chartConfig = {
  contributions: {
    label: "Contributions",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function ContributionChart({ contributionCalendar }: ContributionChartProps) {
  const chartData = useMemo(() => {
    if (!contributionCalendar?.weeks) return [];

    // Flatten all days and create weekly aggregations
    const weeklyData: { week: string; contributions: number; date: string }[] =
      [];

    contributionCalendar.weeks.forEach((week, weekIndex) => {
      const weekContributions = week.contributionDays.reduce(
        (sum, day) => sum + day.contributionCount,
        0
      );

      // Use the first day of the week for the date label
      const firstDay = week.contributionDays[0];
      if (firstDay) {
        const date = new Date(firstDay.date);
        weeklyData.push({
          week: `Week ${weekIndex + 1}`,
          contributions: weekContributions,
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        });
      }
    });

    return weeklyData;
  }, [contributionCalendar]);

  if (!contributionCalendar?.weeks || chartData.length === 0) {
    return (
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Contribution Chart</h3>
        <p className="text-sm text-muted-foreground">
          No contribution data available
        </p>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Weekly Contributions</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--muted-foreground)"
              opacity={0.2}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              interval="preserveStartEnd"
              stroke="var(--muted-foreground)"
              strokeOpacity={0.5}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              label={{
                value: "Contributions",
                angle: -90,
                position: "insideLeft",
                style: {
                  textAnchor: "middle",
                  fill: "var(--muted-foreground)",
                },
              }}
              stroke="var(--muted-foreground)"
              strokeOpacity={0.5}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              type="monotone"
              dataKey="contributions"
              stroke="var(--chart-1)"
              strokeWidth={1}
              dot={{
                fill: "var(--chart-1)",
                strokeWidth: 2,
                r: 5,
                stroke: "var(--background)",
              }}
              activeDot={{
                r: 7,
                stroke: "var(--chart-1)",
                strokeWidth: 3,
                fill: "var(--background)",
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="mt-2 text-sm text-muted-foreground">
          Total contributions: {contributionCalendar.totalContributions ?? 0}
        </div>
      </CardFooter>
    </Card>
  );
}

export default ContributionChart;
