"use client";

import type { GraphQLCommitNode } from "@/types";
import { NoDataCard } from "@/components/no-data-card";

type Props = {
  commits: (GraphQLCommitNode | null)[];
  repoUrl?: string | null;
};

export default function CommitList({ commits, repoUrl }: Props) {
  if (!commits || commits.length === 0) {
    return (
      <NoDataCard
        title="No Commits"
        message="No commits found for this repository."
      />
    );
  }

  return (
    <section className="w-full">
      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        {commits.map((c, idx) => {
          const oid = c?.oid ?? undefined;
          const message = c?.message
            ? (c.message ?? "").split("\n")[0]
            : c?.messageHeadline ?? "";
          const author = c?.author?.user?.login ?? c?.author?.name ?? "Unknown";
          const date = c?.committedDate
            ? new Date(c.committedDate).toLocaleString()
            : "";
          const commitUrl =
            oid && repoUrl
              ? `${repoUrl.replace(/\/$/, "")}/commit/${oid}`
              : undefined;

          return (
            <li key={oid ?? `commit-${idx}`}>
              <div className="font-medium">
                {commitUrl ? (
                  <a
                    href={commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {message}
                  </a>
                ) : (
                  message
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {author}
                {date ? ` • ${date}` : ""}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
