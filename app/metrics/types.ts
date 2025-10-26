export type Count = { totalCount: number } | null | undefined;

export type ContributionDay = {
  date: string;
  contributionCount: number;
  color: string;
};

export type ContributionWeek = {
  contributionDays: ContributionDay[];
};

export type ContributionCalendar = {
  totalContributions?: number | null;
  weeks?: ContributionWeek[] | null;
} | null;

export type ContributionsCollection = {
  totalCommitContributions?: number | null;
  restrictedContributionsCount?: number | null;
  contributionCalendar?: ContributionCalendar;
} | null;

export type LanguageEdge = {
  size: number;
  node: {
    name: string;
    color: string;
  };
};

export type Repository = {
  name: string;
  languages: {
    edges: LanguageEdge[];
  };
};

export type RepositoriesData = { nodes: Repository[] } | null;

export type User = {
  name?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  followers?: Count;
  following?: Count;
  repositories?: {
    totalCount: number;
    nodes: Array<{
      name: string;
      languages: { edges: LanguageEdge[] };
    }>;
  } | null;
  contributionsCollection?: ContributionsCollection;
} | null;

export interface ContributionChartProps {
  contributionCalendar: ContributionCalendar;
}

export interface LanguageUsageProps {
  repositories: RepositoriesData;
}

export interface UserMetricsProps {
  user: User;
  loading: boolean;
  error: Error | null;
  data: unknown;
}
