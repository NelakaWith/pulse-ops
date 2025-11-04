// -- Repository-related types
export type RepositoryTopicNode = {
  topic?: { name?: string } | null;
} | null;

export type LanguagesNode = { name?: string | null } | null;

export interface GraphQLRepo {
  id: string;
  name: string;
  description?: string | null;
  url: string;
  openGraphImageUrl?: string | null;
  stargazerCount?: number | null;
  repositoryTopics?: { nodes: RepositoryTopicNode[] } | null;
  languages?: { nodes: LanguagesNode[] } | null;
}

export interface RepoQueryResult {
  repository?: GraphQLRepo | null;
}

export default GraphQLRepo;

// REST repository shape (from GET /repos/{owner}/{repo})
// Only the fields we care about are included here.
export interface RestRepoOwner {
  login?: string;
  avatar_url?: string;
}

export interface RestRepo {
  id?: number;
  name?: string;
  full_name?: string;
  description?: string | null;
  html_url?: string;
  url?: string;
  topics?: string[];
  language?: string | null;
  stargazers_count?: number;
  owner?: RestRepoOwner | null;
}

// --- Metrics-related types
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

// GraphQL language node/edge shapes (nullable-aware for client use)
export type GraphQLLanguageNode = {
  name?: string | null;
  color?: string | null;
};

export type GraphQLLanguageEdge = {
  size?: number;
  node?: GraphQLLanguageNode;
};

export interface RepoLanguagesQuery {
  repository?: {
    languages?: {
      edges?: GraphQLLanguageEdge[] | null;
    } | null;
  } | null;
}

// Chart-friendly language entry used across the app
export type LanguageChartEntry = {
  name: string;
  value: number;
  color: string;
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
  url?: string | null;
  login?: string | null;
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
