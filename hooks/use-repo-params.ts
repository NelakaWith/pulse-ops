"use client";

import { usePathname } from "next/navigation";

/**
 * useRepoParams
 *
 * Small hook to canonicalize repository owner/name values from either
 * - explicit props (owner, name) or
 * - the current pathname (supports /repos/:repo and /repos/:owner/:repo)
 *
 * Returns an object with { owner, name } suitable for building API endpoints.
 */
export function useRepoParams(
  owner?: string,
  name?: string,
  defaultOwner = "NelakaWith"
) {
  const pathname = usePathname();

  let ownerToUse = owner ?? defaultOwner;
  let nameToUse = name ?? "";

  if (!nameToUse && pathname) {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length >= 2 && parts[0] === "repos") {
      if (parts.length === 2) {
        // /repos/:repo
        nameToUse = decodeURIComponent(parts[1]);
      } else {
        // /repos/:owner/:repo (or deeper)
        ownerToUse = decodeURIComponent(parts[1]) || ownerToUse;
        nameToUse = decodeURIComponent(parts.slice(2).join("/"));
      }
    }
  }

  return { owner: ownerToUse, name: nameToUse };
}
