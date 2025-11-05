"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LoadingState } from "@/components/loading-state";
import { useGraphQL } from "@/hooks/use-graphql";
import type { ReposQuery } from "@/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useUser } from "@/contexts/user-context";
import { AuthGuard } from "@/components/auth-guard";

function RepoList() {
  const { user } = useUser();
  const REPO_QUERY = React.useMemo(
    () => `
    query Repos($login: String!) {
      user(login: $login) {
        repositories(first: 100, orderBy: { field: UPDATED_AT, direction: DESC }) {
          nodes {
            id
            name
            description
            repositoryTopics(first: 10) {
              nodes {
                topic {
                  name
                }
              }
            }
            openGraphImageUrl
            url
            stargazerCount
          }
        }
      }
    }
  `,
    []
  );

  const variables = React.useMemo(
    () => ({ login: user?.login ?? "" }),
    [user?.login]
  );
  const { data, loading, error } = useGraphQL<ReposQuery>(
    user?.login ? REPO_QUERY : null,
    variables
  );

  const repos = data?.user?.repositories?.nodes ?? [];

  return (
    <AuthGuard>
      {loading ? (
        <LoadingState
          message="Loading repositories..."
          className="min-h-screen"
        />
      ) : error ? (
        <p className="text-red-500 p-8">Error: {error.message}</p>
      ) : (
        <section className="w-full">
          <div className="grid grid-cols-4 gap-4 mt-4">
            {Array.isArray(repos) &&
              repos
                .filter((r): r is NonNullable<typeof r> => Boolean(r))
                .map((repo) => {
                  const topics =
                    repo.repositoryTopics?.nodes
                      ?.map((n) => n?.topic?.name)
                      .filter(Boolean) || [];
                  return (
                    <Card key={repo.id ?? repo.name} className="min-h-[400px]">
                      <CardContent className="flex-1">
                        {repo.openGraphImageUrl && (
                          <Image
                            src={repo.openGraphImageUrl}
                            alt={`${repo.name} preview`}
                            className="w-full object-cover rounded-md mb-2"
                            loading="eager"
                            width={500}
                            height={500}
                          />
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-lg">{repo.name}</h3>
                          {repo.stargazerCount !== 0 && (
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-muted-foreground">
                                ⭐ {repo.stargazerCount ?? 0}
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {repo.description}
                        </p>

                        {topics.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {topics.map((t) => (
                              <Badge key={t} variant="outline">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="gap-2">
                        <Button asChild className="flex-1 cursor-pointer">
                          <Link
                            href={`/repos/${encodeURIComponent(
                              repo.name ?? ""
                            )}`}
                          >
                            More Details
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link
                            href={repo.url ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View on GitHub
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
          </div>
        </section>
      )}
    </AuthGuard>
  );
}

export default RepoList;
