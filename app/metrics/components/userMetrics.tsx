import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { FolderGit2, GitGraph } from "lucide-react";
import type { UserMetricsProps } from "../types";

function UserMetrics({ user, loading, error, data }: UserMetricsProps) {
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
                    <FolderGit2 className="inline mr-1 font-bold text-xl" />
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
