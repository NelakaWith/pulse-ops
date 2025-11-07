"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Markdown } from "@/components/markdown";
import { LoadingState } from "@/components/loading-state";

interface RepoInsightsProps {
  data: unknown;
  loading: boolean;
  error: Error | null;
}

export default function RepoInsights({
  data,
  loading,
  error,
}: RepoInsightsProps) {
  if (loading) {
    return (
      <LoadingState message="Generating insights..." className="min-h-screen" />
    );
  }

  if (error) {
    return (
      <div className="mt-4">
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <CardHeader>
            <CardTitle className="text-amber-700 dark:text-amber-400">
              Error Loading Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-600 dark:text-amber-300">
              {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>No Insights Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unable to generate insights at this time. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if data is a cached error
  if (typeof data === "object" && data !== null) {
    const dataObj = data as Record<string, unknown>;
    if ("__error" in dataObj && typeof dataObj.__error === "string") {
      return (
        <div className="mt-4">
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
            <CardHeader>
              <CardTitle className="text-amber-700 dark:text-amber-400">
                Insights are not available at the moment!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-600 dark:text-amber-300">
                {dataObj.__error}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Extract analysis content - adjust based on your API response structure
  let analysisContent = "";

  if (typeof data === "object" && data !== null) {
    const dataObj = data as Record<string, unknown>;
    // Handle nested response: { success, data: { analysis: "..." } }
    if (
      "data" in dataObj &&
      typeof dataObj.data === "object" &&
      dataObj.data !== null
    ) {
      const innerData = dataObj.data as Record<string, unknown>;
      if ("analysis" in innerData && typeof innerData.analysis === "string") {
        analysisContent = innerData.analysis;
      }
    }
    // Handle direct response: { analysis: "..." }
    else if ("analysis" in dataObj && typeof dataObj.analysis === "string") {
      analysisContent = dataObj.analysis;
    }
  }

  // Fallback to string representation if still empty
  if (!analysisContent) {
    analysisContent =
      typeof data === "string" ? data : JSON.stringify(data, null, 2);
  }

  return (
    <main className="w-full">
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Repository Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown content={analysisContent} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
