"use client";
import { useMemo } from "react";
import { useGraphQL } from "@/hooks/use-graphql";
import UserMetrics from "./components/userMetrics";
import ContributionChart from "./components/contributionChart";

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
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(privacy: PUBLIC, first: 10, orderBy: {field: STARGAZERS, direction: DESC}) {
        totalCount
        nodes {
          name
          stargazerCount
          forkCount
          watchers {
            totalCount
          }
          languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
        pullRequestContributions(first: 1) {
          totalCount
        }
        issueContributions(first: 1) {
          totalCount
        }
        pullRequestReviewContributions(first: 1) {
          totalCount
        }
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
        commitContributionsByRepository(maxRepositories: 5) {
          repository {
            name
          }
          contributions {
            totalCount
          }
        }
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
    <main className="p-8 w-full">
      <h1 className="text-2xl font-bold mb-4">Metrics</h1>
      <div className="space-y-6 w-full">
        <UserMetrics user={user} loading={loading} error={error} data={data} />
        {user?.contributionsCollection?.contributionCalendar && (
          <ContributionChart
            contributionCalendar={
              user.contributionsCollection.contributionCalendar
            }
          />
        )}
      </div>
    </main>
  );
}
