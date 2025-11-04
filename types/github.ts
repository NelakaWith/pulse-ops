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

// --- Commit-related GraphQL shapes
export type GraphQLCommitAuthorUser = {
  login?: string | null;
  avatarUrl?: string | null;
} | null;

export type GraphQLCommitAuthor = {
  name?: string | null;
  email?: string | null;
  user?: GraphQLCommitAuthorUser | null;
} | null;

export type GraphQLCommitNode = {
  oid?: string | null;
  messageHeadline?: string | null;
  message?: string | null;
  committedDate?: string | null;
  author?: GraphQLCommitAuthor | null;
} | null;

export interface RepoLanguagesQuery {
  repository?: {
    languages?: {
      edges?: GraphQLLanguageEdge[] | null;
    } | null;
  } | null;
}

// Query shape for listing user repositories (used in the repo list)
export interface ReposQuery {
  user?: {
    repositories?: {
      nodes?: Array<{
        id?: string | null;
        name?: string | null;
        description?: string | null;
        repositoryTopics?: { nodes?: RepositoryTopicNode[] | null } | null;
        openGraphImageUrl?: string | null;
        url?: string | null;
        stargazerCount?: number | null;
      } | null> | null;
    } | null;
  } | null;
}

// Chart-friendly language entry used across the app
export type LanguageChartEntry = {
  name: string;
  value: number;
  color: string;
};

// Repository details including topics and language edges (for a single repo query)
export interface RepoDetailsQuery {
  repository?: {
    id?: string;
    name?: string;
    description?: string | null;
    url?: string;
    stargazerCount?: number | null;
    repositoryTopics?: { nodes?: RepositoryTopicNode[] | null } | null;
    languages?: { edges?: GraphQLLanguageEdge[] | null } | null;
    owner?: { login?: string | null; avatarUrl?: string | null } | null;
    defaultBranchRef?: {
      name?: string | null;
      target?: {
        history?: { nodes?: GraphQLCommitNode[] | null } | null;
      } | null;
    } | null;
  } | null;
}

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
