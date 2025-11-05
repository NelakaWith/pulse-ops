"use client";

import type { GraphQLReleaseNode } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Tag } from "lucide-react";

type Props = {
  releases: (GraphQLReleaseNode | null)[];
};

export default function ReleaseList({ releases }: Props) {
  if (!releases || releases.length === 0) return null;

  return (
    <section className="w-full">
      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        {releases.map((r, idx) => {
          const id = r?.id ?? `release-${idx}`;
          const name = r?.name ?? r?.tagName ?? "untitled";
          const tag = r?.tagName ?? undefined;
          const url = r?.url ?? undefined;
          const date = r?.publishedAt ?? r?.createdAt ?? undefined;
          const dateLabel = date ? new Date(date).toLocaleString() : "";
          const author = r?.author?.login ?? "Unknown";
          const isPre = !!r?.isPrerelease;
          const isDraft = !!r?.isDraft;

          return (
            <li key={id}>
              <div className="font-medium flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="truncate font-semibold flex items-center gap-2">
                      <div className="truncate">{name}</div>
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View release ${name}`}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : null}
                    </div>
                    {tag ? (
                      <Badge
                        variant="outline"
                        className="text-xs inline-flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        <span className="truncate">{tag}</span>
                      </Badge>
                    ) : null}
                    {isDraft ? (
                      <Badge variant="destructive" className="text-xs">
                        Draft
                      </Badge>
                    ) : null}
                    {isPre ? (
                      <Badge variant="secondary" className="text-xs">
                        Pre-release
                      </Badge>
                    ) : null}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {author}
                    {dateLabel ? ` • ${dateLabel}` : ""}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
