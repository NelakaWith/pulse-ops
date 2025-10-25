"use client";
import { useMemo } from "react";
import { useGraphQL } from "@/hooks/use-graphql";
import Image from "next/image";

type Count = { totalCount: number } | null | undefined;

type ContributionCalendar = { totalContributions?: number | null } | null;

type ContributionsCollection = {
  totalCommitContributions?: number | null;
  restrictedContributionsCount?: number | null;
  contributionCalendar?: ContributionCalendar;
} | null;

type User = {
  name?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  followers?: Count;
  following?: Count;
  repositories?: Count;
  contributionsCollection?: ContributionsCollection;
} | null;

const USER_QUERY = `
  query User($login: String!) {
    user(login: $login) {
      name
      avatarUrl
      bio
      followers { totalCount }
      following { totalCount }
      repositories { totalCount }
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
        contributionCalendar { totalContributions }
      }
    }
  }
`;

export default function MetricsPage() {
  const variables = useMemo(() => ({ login: "NelakaWith" }), []);

  const { data, loading, error } = useGraphQL<{ user: User }>(
    USER_QUERY,
    variables
  );

  const user: User = data?.user ?? null;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Metrics</h1>

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
          <div>
            <h2 className="text-xl font-semibold">{user.name ?? "—"}</h2>
            {user.bio && (
              <p className="text-sm text-muted-foreground">{user.bio}</p>
            )}

            <div className="mt-3 flex gap-4 text-sm">
              <div>
                <div className="font-medium">Followers</div>
                <div>{user.followers?.totalCount ?? 0}</div>
              </div>
              <div>
                <div className="font-medium">Following</div>
                <div>{user.following?.totalCount ?? 0}</div>
              </div>
              <div>
                <div className="font-medium">Public repos</div>
                <div>{user.repositories?.totalCount ?? 0}</div>
              </div>
            </div>

            <div className="mt-4 text-sm">
              <div>
                Total commit contributions:{" "}
                {user.contributionsCollection?.totalCommitContributions ?? 0}
              </div>
              <div>
                Restricted contributions:{" "}
                {user.contributionsCollection?.restrictedContributionsCount ??
                  0}
              </div>
              <div>
                Contribution calendar total:{" "}
                {user.contributionsCollection?.contributionCalendar
                  ?.totalContributions ?? 0}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <pre className="bg-gray-100 p-4 rounded mt-2 overflow-x-auto">
          {data ? JSON.stringify(data, null, 2) : "No data"}
        </pre>
      )}
    </main>
  );
}
