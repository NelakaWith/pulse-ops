"use client";
import { useMemo } from "react";
import { useGraphQL } from "@/hooks/use-graphql";
import UserMetrics from "./components/userMetrics";
import ContributionChart from "./components/contributionChart";
import LanguageUsage from "./components/languageUsage";
import type { User } from "./types";

const USER_QUERY = `
  query User($login: String!) {
    user(login: $login) {
      name
      avatarUrl
      bio
      company
      location
      url
      followers {
        totalCount
      }
      following {
        totalCount
      }

      # --- Repositories (Top 10 by stars) ---
      repositories(
        privacy: PUBLIC
        first: 10
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          url
          stargazerCount
          forkCount
          watchers {
            totalCount
          }
          openIssues: issues(states: OPEN) {
            totalCount
          }
          closedIssues: issues(states: CLOSED) {
            totalCount
          }
          openPullRequests: pullRequests(states: OPEN) {
            totalCount
          }
          mergedPullRequests: pullRequests(states: MERGED) {
            totalCount
          }
          closedPullRequests: pullRequests(states: CLOSED) {
            totalCount
          }
          releases {
            totalCount
          }
          languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
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

      # --- Contribution Breakdown ---
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount

        pullRequestContributions(first: 100) {
          totalCount
          nodes {
            pullRequest {
              state
              merged
              createdAt
              mergedAt
              closedAt
            }
          }
        }

        issueContributions(first: 100) {
          totalCount
          nodes {
            issue {
              state
              createdAt
              closedAt
            }
          }
        }

        pullRequestReviewContributions(first: 100) {
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
      <div className="space-y-6 w-full">
        <UserMetrics user={user} loading={loading} error={error} data={data} />
        <div className="flex gap-4">
          {user?.contributionsCollection?.contributionCalendar && (
            <ContributionChart
              contributionCalendar={
                user.contributionsCollection.contributionCalendar
              }
            />
          )}
          {data?.user?.repositories && (
            <LanguageUsage repositories={data.user.repositories} />
          )}
        </div>
      </div>
    </main>
  );
}
