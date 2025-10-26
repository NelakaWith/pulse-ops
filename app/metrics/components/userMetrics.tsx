import Image from "next/image";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FolderGit, GitGraph, GitPullRequestArrow, Rocket } from "lucide-react";
import type { UserMetricsProps } from "../types";

function UserMetrics({ user, loading, error, data }: UserMetricsProps) {
  const totalReleases = useMemo(() => {
    const nodes = user?.repositories?.nodes ?? [];
    return nodes.reduce(
      (sum, repo) => sum + (repo.releases?.totalCount ?? 0),
      0
    );
  }, [user?.repositories?.nodes]);

  return (
    <>
      {loading && <p>Loading metrics...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {user ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={user.avatarUrl ?? ""}
              alt={user.name ?? "avatar"}
              className="h-24 w-24 rounded-full"
              width={64}
              height={64}
            />
            <div>
              <h2 className="text-xl font-semibold">
                {user.name ?? "—"}{" "}
                <span className="text-neutral-400 font-light">
                  @{user.login ?? "—"}
                </span>
              </h2>
              {user.bio && (
                <p className="text-sm text-muted-foreground">{user.bio}</p>
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="mt-3 flex gap-4 text-sm">
              <Card className="flex-1 h-32 bg-purple-50">
                <CardContent className="h-full flex flex-col justify-between">
                  <div className="flex items-center">
                    <FolderGit className="inline mr-1 font-bold text-purple-400" />
                  </div>
                  <div className="flex items-end justify-end text-lg ">
                    <span className="font-light me-2">Repos</span>
                    <span className="font-light text-6xl">
                      {user.repositories?.totalCount ?? 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex-1 h-32 bg-green-50">
                <CardContent className="h-full flex flex-col justify-between">
                  <div className="flex items-center">
                    <GitGraph className="inline mr-1 font-bold text-green-400" />
                  </div>
                  <div className="flex items-end justify-end text-lg ">
                    <span className="font-light me-2">Commits</span>
                    <span className="font-light text-6xl">
                      {user.contributionsCollection?.totalCommitContributions ??
                        0}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex-1 h-32 bg-blue-50">
                <CardContent className="h-full flex flex-col justify-between">
                  <div className="flex items-center">
                    <GitPullRequestArrow className="inline mr-1 font-bold text-blue-400" />
                  </div>
                  <div className="flex items-end justify-end text-lg ">
                    <span className="font-light me-2">PRs</span>
                    <span className="font-light text-6xl">
                      {user.contributionsCollection?.pullRequestContributions
                        ?.totalCount ?? 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex-1 h-32 bg-red-50">
                <CardContent className="h-full flex flex-col justify-between">
                  <div className="flex items-center">
                    <Rocket className="inline mr-1 font-bold text-red-400" />
                  </div>
                  <div className="flex items-end justify-end text-lg ">
                    <span className="font-light me-2">Releases</span>
                    <span className="font-light text-6xl">{totalReleases}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <pre className="bg-gray-100 p-4 rounded mt-2 overflow-x-auto">
          {data ? JSON.stringify(data, null, 2) : "No data"}
        </pre>
      )}
    </>
  );
}

export default UserMetrics;
