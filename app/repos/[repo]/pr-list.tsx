"use client";

import type { GraphQLPullRequestNode } from "@/types";

type Props = {
  prs: (GraphQLPullRequestNode | null)[];
};

export default function PRList({ prs }: Props) {
  if (!prs || prs.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium">Recent pull requests</h3>
      <ul className="mt-2 space-y-3 text-sm text-muted-foreground">
        {prs.map((pr, idx) => {
          const id = pr?.id ?? `pr-${idx}`;
          const title = pr?.title ?? `#${pr?.number ?? ""}`;
          const author = pr?.author?.login ?? "Unknown";
          const date = pr?.createdAt
            ? new Date(pr.createdAt).toLocaleString()
            : "";

          return (
            <li key={id}>
              <div className="font-medium">
                <a
                  href={pr?.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {title}
                </a>
              </div>
              <div className="text-xs text-muted-foreground">
                {author}
                {date ? ` • ${date}` : ""}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
