"use client";
import { useMemo } from "react";
import { useGraphQL } from "@/hooks/use-graphql";
import { useUser } from "@/contexts/user-context";
import UserMetrics from "./components/userMetrics";
import ContributionChart from "./components/contributionChart";
import LanguageUsage from "./components/languageUsage";
import type { User } from "@/types";

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
  const { user: currentUser } = useUser();
  const variables = useMemo(
    () => ({ login: currentUser?.login ?? "NelakaWith" }),
    [currentUser?.login]
  );
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
            <div className="flex-2">
              <ContributionChart
                contributionCalendar={
                  user.contributionsCollection.contributionCalendar
                }
              />
            </div>
          )}
          {data?.user?.repositories && (
            <div className="flex-1">
              <LanguageUsage repositories={data.user.repositories} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
