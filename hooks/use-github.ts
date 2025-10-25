import { useCallback, useEffect, useState } from "react";
import axios from "axios";

/**
 * Simple hook to call the local `/api/github?endpoint=...` proxy route.
 *
 * Usage:
 * const { data, loading, error, refetch } = useGithub('repos/nelaka/repo-name')
 */
export function useGithub(endpoint?: string | null) {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const fetcher = useCallback(async (ep?: string | null) => {
    if (!ep) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/github", { params: { endpoint: ep } });
      setData(res.data);
    } catch (err) {
      const message = err instanceof Error ? err : new Error(String(err));
      setError(message as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetcher(endpoint);
  }, [endpoint, fetcher]);

  const refetch = useCallback(() => fetcher(endpoint), [endpoint, fetcher]);

  return { data, error, loading, refetch } as const;
}

export type UseGithubResult = ReturnType<typeof useGithub>;
