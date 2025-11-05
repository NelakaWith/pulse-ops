"use client";

import type { GraphQLDeploymentNode } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Tag, ExternalLink } from "lucide-react";

type Props = {
  deployments: (GraphQLDeploymentNode | null)[];
};

export default function DeploymentList({ deployments }: Props) {
  if (!deployments || deployments.length === 0) return null;

  return (
    <section className="w-full">
      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        {deployments.map((d, idx) => {
          const id = d?.id ?? `deployment-${idx}`;
          const env = d?.environment ?? "unknown";
          const task = d?.task ?? "";
          const refName = d?.ref?.name ?? "";
          const creator = d?.creator?.login ?? "Unknown";
          const created = d?.createdAt
            ? new Date(d.createdAt).toLocaleString()
            : "";
          const status = d?.latestStatus?.state ?? "";
          const envUrl = d?.latestStatus?.environmentUrl ?? undefined;
          const logUrl = d?.latestStatus?.logUrl ?? undefined;
          // Prefer environmentUrl, then logUrl as a fallback for an "Open" link
          const linkUrl = envUrl ?? logUrl ?? undefined;
          const statusKey = (status || "").toLowerCase();

          const { textClass, bgClass, dotClass } = (() => {
            // Map common deployment status values to tailwind color classes
            if (/(success|succeeded|successful)/i.test(statusKey))
              return {
                textClass: "text-green-700",
                bgClass: "bg-green-100",
                dotClass: "bg-green-500",
              };
            if (/(failed|failure|error|errored)/i.test(statusKey))
              return {
                textClass: "text-red-700",
                bgClass: "bg-red-100",
                dotClass: "bg-red-500",
              };
            if (/(in[_-]?progress|running)/i.test(statusKey))
              return {
                textClass: "text-amber-700",
                bgClass: "bg-amber-100",
                dotClass: "bg-amber-500",
              };
            if (/(pending|queued|created)/i.test(statusKey))
              return {
                textClass: "text-sky-700",
                bgClass: "bg-sky-100",
                dotClass: "bg-sky-500",
              };
            // default
            return {
              textClass: "text-muted-foreground",
              bgClass: "bg-muted",
              dotClass: "bg-gray-400",
            };
          })();

          return (
            <li key={id}>
              <div className="font-medium flex items-center gap-3">
                {/* link icon and status on the left */}
                <div className="flex items-center gap-3 min-w-28">
                  {linkUrl ? (
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open deployment ${env}`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <div className="w-4 h-4" />
                  )}

                  <Badge
                    className={`${textClass} ${bgClass} inline-flex items-center gap-2`}
                  >
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${dotClass}`}
                      aria-hidden
                    />
                    <span className="capitalize">{status || "unknown"}</span>
                  </Badge>
                </div>

                {/* main content */}
                <div className="flex-1">
                  <div className="truncate">{env}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    {task ? <span>{task} •</span> : null}
                    {refName ? (
                      <Badge
                        variant="outline"
                        className="inline-flex items-center gap-1 text-xs"
                      >
                        <Tag className="w-3 h-3" />
                        <span className="truncate">{refName}</span>
                      </Badge>
                    ) : null}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {creator}
                    {created ? ` • ${created}` : ""}
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
