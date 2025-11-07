"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoDataCard } from "@/components/no-data-card";
import { StatusCard } from "@/components/status-card";
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
      <StatusCard
        status="warning"
        title="Error Loading Insights"
        message={error.message}
      />
    );
  }

  if (!data) {
    return (
      <NoDataCard
        title="No Insights Available"
        message="Unable to generate insights at this time. Please try again later."
      />
    );
  }

  // Check if data is a cached error
  if (typeof data === "object" && data !== null) {
    const dataObj = data as Record<string, unknown>;
    if ("__error" in dataObj && typeof dataObj.__error === "string") {
      return (
        <StatusCard
          status="warning"
          title="Insights are not available at the moment!"
          message={dataObj.__error}
        />
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
