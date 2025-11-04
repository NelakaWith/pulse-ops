"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGraphQL } from "@/hooks/use-graphql";
import { useRepoParams } from "@/hooks/use-repo-params";
import CommitList from "./commit-list";
import PRList from "./pr-list";
import LanguageUsage from "./language-usage";

import type {
  RepoDetailsQuery,
  LanguageChartEntry,
  GraphQLLanguageEdge,
  GraphQLPullRequestNode,
  GraphQLCommitNode,
} from "@/types";

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
        defaultBranchRef {
          name
          target {
            ... on Commit {
              history(first: 10) {
                nodes {
                  oid
                  messageHeadline
                  message
                  committedDate
                  author { name email user { login avatarUrl }}
                }
              }
            }
          }
        }
        pullRequests(first: 10, orderBy: { field: UPDATED_AT, direction: DESC }) {
          nodes {
            id
            number
            title
            url
            createdAt
            closedAt
            mergedAt
            state
            author { login avatarUrl }
          }
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

  // Extract recent commits (default branch history)
  const commits = React.useMemo(() => {
    const nodes = (data?.repository?.defaultBranchRef?.target?.history?.nodes ??
      []) as GraphQLCommitNode[];
    return nodes.slice(0, 10).filter(Boolean) as GraphQLCommitNode[];
  }, [data]);

  const pullRequests = React.useMemo(() => {
    return (data?.repository?.pullRequests?.nodes ??
      []) as GraphQLPullRequestNode[];
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

          <LanguageUsage languages={chartData} />
          <Tabs defaultValue="commits" className="mt-4">
            <TabsList>
              <TabsTrigger value="commits">Recent commits</TabsTrigger>
              <TabsTrigger value="prs">Recent pull requests</TabsTrigger>
            </TabsList>
            <TabsContent value="commits">
              <CommitList commits={commits} repoUrl={repo?.url} />
            </TabsContent>
            <TabsContent value="prs">
              <PRList prs={pullRequests} />
            </TabsContent>
          </Tabs>

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
