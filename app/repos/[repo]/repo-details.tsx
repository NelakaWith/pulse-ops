"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/components/loading-state";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGraphQL } from "@/hooks/use-graphql";
import { useRepoParams } from "@/hooks/use-repo-params";
import CommitList from "./commit-list";
import PRList from "./pr-list";
import DeploymentList from "./deployment-list";
import ReleaseList from "./release-list";
import LanguageUsage from "./language-usage";

import type {
  RepoDetailsQuery,
  LanguageChartEntry,
  GraphQLLanguageEdge,
  GraphQLPullRequestNode,
  GraphQLCommitNode,
} from "@/types";

export default function RepoDetails({
  owner,
  name,
}: {
  owner?: string;
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
              history(first: 20) {
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
        pullRequests(first: 20, orderBy: { field: UPDATED_AT, direction: DESC }) {
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
        releases(first: 20, orderBy: { field: CREATED_AT, direction: DESC }) {
          nodes {
            id
            name
            tagName
            url
            createdAt
            publishedAt
            isDraft
            isPrerelease
            author { login avatarUrl }
          }
        }
        deployments(first: 20) {
          nodes {
            id
            environment
            createdAt
            task
            ref { name }
            creator { login avatarUrl }
            latestStatus {
              state
              createdAt
              environmentUrl
              logUrl
            }
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

  // Skip query if owner or name is missing or empty
  const shouldSkip =
    !ownerToUse ||
    !nameToUse ||
    ownerToUse.trim() === "" ||
    nameToUse.trim() === "";

  const { data, loading, error } = useGraphQL<RepoDetailsQuery>(
    shouldSkip ? null : REPO_QUERY,
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
    return nodes.slice(0, 20).filter(Boolean) as GraphQLCommitNode[];
  }, [data]);

  const pullRequests = React.useMemo(() => {
    return (data?.repository?.pullRequests?.nodes ??
      []) as GraphQLPullRequestNode[];
  }, [data]);

  // If no valid owner/name, show loading state (check after all hooks)
  if (shouldSkip) {
    return (
      <LoadingState
        message="Loading repository details..."
        className="min-h-screen"
      />
    );
  }

  if (loading) {
    return (
      <LoadingState
        message="Loading repository details..."
        className="min-h-screen"
      />
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
          <Tabs
            defaultValue="commits"
            className="mt-4 flex flex-col h-[calc(100vh-23rem)]"
          >
            <TabsList>
              <TabsTrigger value="commits" className="cursor-pointer">
                Recent commits
              </TabsTrigger>
              <TabsTrigger value="prs" className="cursor-pointer">
                Recent pull requests
              </TabsTrigger>
              <TabsTrigger value="deployments" className="cursor-pointer">
                Recent deployments
              </TabsTrigger>
              <TabsTrigger value="releases" className="cursor-pointer">
                Recent releases
              </TabsTrigger>
            </TabsList>
            <TabsContent value="commits" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <CommitList commits={commits} repoUrl={repo?.url} />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="prs" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <PRList prs={pullRequests} />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="deployments" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <DeploymentList deployments={repo.deployments?.nodes || []} />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="releases" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <ReleaseList releases={repo.releases?.nodes || []} />
              </ScrollArea>
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
