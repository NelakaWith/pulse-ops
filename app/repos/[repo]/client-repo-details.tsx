"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useGithub } from "@/hooks/use-github";
import type { RestRepo } from "@/types";
import { useRepoParams } from "@/hooks/use-repo-params";

type Props = {
  owner: string;
  name: string;
};

export default function ClientRepoDetails({ owner, name }: Props) {
  const { owner: ownerToUse, name: nameToUse } = useRepoParams(owner, name);

  const endpoint = React.useMemo(
    () => `repos/${ownerToUse}/${nameToUse}`,
    [ownerToUse, nameToUse]
  );
  const { data, loading, error } = useGithub(endpoint);
  const repo = (data as unknown as RestRepo) ?? null;

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

  const topics: string[] = Array.isArray(repo?.topics)
    ? (repo!.topics as string[])
    : [];
  const languages: string[] = repo?.language ? [repo.language] : [];
  const htmlUrl = repo?.html_url ?? "";

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

          {languages.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Languages: {languages.join(", ")}
            </div>
          )}

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
