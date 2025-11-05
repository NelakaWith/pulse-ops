import { NextResponse } from "next/server";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

const QUERY = `
  query GetUser($login: String!) {
    user(login: $login) {
      name
      avatarUrl
      bio
      followers { totalCount }
      following { totalCount }
      repositories(privacy: PUBLIC) { totalCount }
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
        pullRequestContributions(first: 1) { totalCount }
        issueContributions(first: 1) { totalCount }
        pullRequestReviewContributions(first: 1) { totalCount }
        contributionCalendar { totalContributions }
      }
    }
  }
`;

export async function GET(req: Request) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN not configured" },
      { status: 500 }
    );
  }

  try {
    // Extract login from URL search params
    const { searchParams } = new URL(req.url);
    const login = searchParams.get("login");

    if (!login) {
      return NextResponse.json(
        { error: "GitHub username is required" },
        { status: 400 }
      );
    }

    const res = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { login },
      }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const query = body?.query ?? QUERY;
    const variables = body?.variables ?? {};

    // Validate that login is provided in variables
    if (!variables.login) {
      return NextResponse.json(
        { error: "GitHub username is required in variables" },
        { status: 400 }
      );
    }

    const res = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
