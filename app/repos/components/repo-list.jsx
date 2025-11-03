"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGraphQL } from "@/hooks/use-graphql";
import Image from "next/image";

function RepoList() {
  const REPO_QUERY = React.useMemo(
    () => `
    query Repos($login: String!) {
      user(login: $login) {
        repositories(first: 100, orderBy: { field: UPDATED_AT, direction: DESC }) {
          nodes {
            id
            name
            description
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

  const variables = React.useMemo(() => ({ login: "NelakaWith" }), []);
  const { data, loading, error } = useGraphQL(REPO_QUERY, variables);
  const repos = data?.user?.repositories?.nodes ?? null;

  return (
    <section className="w-full">
      {loading && (
        <div className="grid grid-cols-3 gap-4 mt-4 w-full">
          {Array.from({ length: 12 }).map((_, index) => (
            <div className="flex flex-col space-y-3" key={index}>
              <Skeleton className="h-[200px] w-[500px] rounded-xl" />
            </div>
          ))}
        </div>
      )}
      {error && <p>Error: {error.message}</p>}
      {repos && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {Array.isArray(repos) &&
            repos.map((repo) => (
              <Card key={repo.id} className="p-4">
                {repo.openGraphImageUrl && (
                  <Image
                    src={repo.openGraphImageUrl}
                    alt={`${repo.name} preview`}
                    className="w-full h-40 object-cover rounded-md mb-2"
                    width={500}
                    height={500}
                  />
                )}
                <h3 className="font-bold text-lg">{repo.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {repo.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    View on GitHub
                  </a>
                  <div className="text-sm text-muted-foreground">
                    ⭐ {repo.stargazerCount ?? 0}
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </section>
  );
}

export default RepoList;
