import { useCallback, useEffect, useState } from "react";
import { gql } from "@apollo/client";
import apolloClient from "@/lib/apollo-client";

/**
 * Simple generic GraphQL hook using the shared apollo client.
 * query: GraphQL query string (can be created with the gql tag or plain string)
 */
export function useGraphQL<T = unknown>(
  query?: string | null,
  variables?: Record<string, unknown>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!!query);
  const [error, setError] = useState<Error | null>(null);

  const fetcher = useCallback(async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      // If running in the browser and there's no NEXT_PUBLIC token, route
      // the request through our server proxy so tokens stay server-side.
      if (
        typeof window !== "undefined" &&
        !process.env.NEXT_PUBLIC_GITHUB_TOKEN
      ) {
        const resp = await fetch("/api/github-graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables }),
        });
        const json = await resp.json();
        // GitHub returns { data, errors }
        setData((json?.data ?? json) as T);
      } else {
        const res = await apolloClient.query({
          query: gql`
            ${query}
          `,
          variables,
          fetchPolicy: "no-cache",
        });
        setData(res.data as T);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [query, variables]);

  useEffect(() => {
    void fetcher();
  }, [fetcher]);

  const refetch = useCallback(() => fetcher(), [fetcher]);

  return { data, loading, error, refetch } as const;
}

export type UseGraphQLResult<T = unknown> = ReturnType<typeof useGraphQL<T>>;
