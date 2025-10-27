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

  const metricCards = useMemo(() => {
    return [
      {
        key: "repos",
        label: "Repos",
        value: user?.repositories?.totalCount ?? 0,
        bg: "bg-purple-50",
        iconClass: "text-purple-400",
        Icon: FolderGit,
      },
      {
        key: "commits",
        label: "Commits",
        value: user?.contributionsCollection?.totalCommitContributions ?? 0,
        bg: "bg-green-50",
        iconClass: "text-green-400",
        Icon: GitGraph,
      },
      {
        key: "prs",
        label: "PRs",
        value:
          user?.contributionsCollection?.pullRequestContributions?.totalCount ??
          0,
        bg: "bg-blue-50",
        iconClass: "text-blue-400",
        Icon: GitPullRequestArrow,
      },
      {
        key: "releases",
        label: "Releases",
        value: totalReleases,
        bg: "bg-red-50",
        iconClass: "text-red-400",
        Icon: Rocket,
      },
    ];
  }, [user, totalReleases]);

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
              className="h-10 w-10 rounded-full"
              width={40}
              height={40}
            />
            <div>
              <h2 className="text-2xl font-semibold">
                {user.name ?? "—"}{" "}
                <span className="text-neutral-400 font-light">
                  @{user.login ?? "—"}
                </span>
              </h2>
              {user.bio && (
                <p className="text-sm text-neutral-600">{user.bio}</p>
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="mt-3 flex gap-4 text-sm">
              {metricCards.map(({ key, label, value, bg, iconClass, Icon }) => (
                <Card key={key} className={`flex-1 h-32 ${bg}`}>
                  <CardContent className="h-full flex justify-between">
                    <div className="flex items-center">
                      <Icon
                        className={`inline mr-1 font-bold ${iconClass}`}
                        size={65}
                      />
                    </div>
                    <div className="flex items-end justify-end text-lg ">
                      <span className="font-light me-2">{label}</span>
                      <span className="font-light text-6xl">{value}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
