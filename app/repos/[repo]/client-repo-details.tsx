"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useGraphQL } from "@/hooks/use-graphql";
import type {
  RepoDetailsQuery,
  LanguageChartEntry,
  GraphQLLanguageEdge,
} from "@/types";
import { useRepoParams } from "@/hooks/use-repo-params";

export default function ClientRepoDetails({
  owner,
  name,
}: {
  owner: string;
  name: string;
}) {
  const { owner: ownerToUse, name: nameToUse } = useRepoParams(owner, name);

  // Single GraphQL query that fetches repo details, topics, and languages (with color)
  const REPO_QUERY = React.useMemo(
    () => `
    query RepoDetails($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        id
        name
        description
        url
        stargazerCount
        repositoryTopics(first: 20) {
          nodes { topic { name } }
        }
        languages(first: 32) {
          edges { size node { name color } }
        }
        owner { login avatarUrl }
      }
    }
  `,
    []
  );

  const vars = React.useMemo(
    () => ({ owner: ownerToUse, name: nameToUse }),
    [ownerToUse, nameToUse]
  );
  const { data, loading, error } = useGraphQL<RepoDetailsQuery>(
    REPO_QUERY,
    vars
  );

  const repo = (data && data.repository) ?? null;

  const chartData = React.useMemo<LanguageChartEntry[]>(() => {
    const edges = ((data &&
      data.repository &&
      data.repository.languages &&
      data.repository.languages.edges) ||
      []) as GraphQLLanguageEdge[];

    const languageMap = new Map<string, { size: number; color: string }>();

    edges.forEach((edge) => {
      const name = edge.node?.name ?? "";
      const color = edge.node?.color ?? "";
      const size = edge.size ?? 0;
      if (!name) return;

      if (languageMap.has(name)) {
        const existing = languageMap.get(name)!;
        languageMap.set(name, {
          size: existing.size + size,
          color: existing.color || color,
        });
      } else {
        languageMap.set(name, { size, color });
      }
    });

    const languageArray = Array.from(languageMap.entries())
      .map(([name, { size, color }]) => ({ name, value: size, color }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    return languageArray;
  }, [data]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-64 mb-4" />
        <Skeleton className="h-6 mb-2 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Error: {error.message}</p>
        <div className="mt-2">
          <Link href="/repos" className="text-primary underline">
            Back to repos
          </Link>
        </div>
      </div>
    );
  }

  if (!repo) {
    return (
      <main className="p-6">
        <h2 className="text-xl font-semibold">Repository not found</h2>
        <p className="mt-2">No repository matched &quot;{name}&quot;.</p>
        <div className="mt-4">
          <Link href="/repos" className="text-primary underline">
            Back to repos
          </Link>
        </div>
      </main>
    );
  }

  const topics: string[] = (
    (repo?.repositoryTopics && repo.repositoryTopics.nodes) ||
    []
  )
    .map((n) => n?.topic?.name ?? "")
    .filter(Boolean) as string[];

  // Keep a simple fallback for older fields — GraphQL provides languages in chartData
  const languages: string[] = [];
  const htmlUrl = repo?.url ?? "";

  return (
    <section className="w-full">
      <Card>
        <CardContent>
          <h1 className="text-2xl font-bold">{repo?.name ?? name}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {repo?.description}
          </p>

          {topics.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {topics.map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          )}

          {chartData.length > 0 ? (
            <div className="mt-4 flex flex-col gap-2">
              {chartData.map((l) => (
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
            </div>
          ) : languages.length > 0 ? (
            <div className="mt-4 text-sm text-muted-foreground">
              Languages: {languages.join(", ")}
            </div>
          ) : null}

          <div className="mt-6 flex gap-3">
            <a
              href={htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border rounded-md text-sm"
            >
              View on GitHub
            </a>
            <Link href="/repos" className="px-4 py-2 border rounded-md text-sm">
              Back to repos
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
