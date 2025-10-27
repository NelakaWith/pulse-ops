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
      login
      followers {
        totalCount
      }
      following {
        totalCount
      }
      # --- Repositories (Top results by stars) ---
      repositories(
        privacy: PUBLIC
        first: 20
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          # releases total used for the Releases card
          releases {
            totalCount
          }
          # languages used by the language usage pie chart
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
    </main>
  );
}
