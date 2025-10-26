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
  pullRequestContributions?: { totalCount: number } | null;
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
  url?: string;
  stargazerCount?: number;
  forkCount?: number;
  watchers?: { totalCount: number } | null;
  openIssues?: { totalCount: number } | null;
  closedIssues?: { totalCount: number } | null;
  openPullRequests?: { totalCount: number } | null;
  mergedPullRequests?: { totalCount: number } | null;
  closedPullRequests?: { totalCount: number } | null;
  releases?: { totalCount: number } | null;
  languages: {
    edges: LanguageEdge[];
  };
};

export type RepositoriesData = {
  totalCount?: number;
  nodes: Repository[];
} | null;

export type User = {
  name?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  followers?: Count;
  following?: Count;
  repositories?: RepositoriesData;
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
