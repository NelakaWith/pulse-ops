"use client";

import { useUser } from "@/contexts/user-context";
import { AuthGuard } from "@/components/auth-guard";
import { Skeleton } from "@/components/ui/skeleton";
import RepoDetails from "./repo-details";

export function RepoPageClient({ repoName }: { repoName: string }) {
  const { user } = useUser();
  const owner = user?.login;

  return (
    <AuthGuard
      loadingFallback={
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      }
    >
      <RepoDetails name={repoName} owner={owner} />
    </AuthGuard>
  );
}
