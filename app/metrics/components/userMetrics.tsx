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
        <div className="flex items-start gap-6">
          <Image
            src={user.avatarUrl ?? ""}
            alt={user.name ?? "avatar"}
            className="h-24 w-24 rounded-full"
            width={96}
            height={96}
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user.name ?? "—"}</h2>
            {user.bio && (
              <p className="text-sm text-muted-foreground">{user.bio}</p>
            )}

            <div className="mt-3 flex gap-4 text-sm">
              <Card className="min-w-64 h-32">
                <CardContent className="h-full flex flex-col justify-between">
                  <div className="flex items-center">
                    <FolderGit className="inline mr-1 font-bold text-xl" />
                  </div>
                  <div className="flex items-center justify-end text-lg ">
                    <span className="font-light me-2">Repos</span>
                    <span className="font-semibold">
                      {user.repositories?.totalCount ?? 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card className="min-w-64 h-32">
                <CardContent className="h-full flex flex-col justify-between">
                  <div className="flex items-center">
                    <GitGraph className="inline mr-1 font-bold text-xl" />
                  </div>
                  <div className="flex items-center justify-end text-lg ">
                    <span className="font-light me-2">Commits</span>
                    <span className="font-semibold">
                      {user.contributionsCollection?.totalCommitContributions ??
                        0}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card className="min-w-64 h-32">
                <CardContent className="h-full flex flex-col justify-between">
                  <div className="flex items-center">
                    <GitPullRequestArrow className="inline mr-1 font-bold text-xl" />
                  </div>
                  <div className="flex items-center justify-end text-lg ">
                    <span className="font-light me-2">PRs</span>
                    <span className="font-semibold">
                      {user.contributionsCollection?.pullRequestContributions
                        ?.totalCount ?? 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card className="min-w-64 h-32">
                <CardContent className="h-full flex flex-col justify-between">
                  <div className="flex items-center">
                    <Rocket className="inline mr-1 font-bold text-xl" />
                  </div>
                  <div className="flex items-center justify-end text-lg ">
                    <span className="font-light me-2">Releases</span>
                    <span className="font-semibold">{totalReleases}</span>
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
