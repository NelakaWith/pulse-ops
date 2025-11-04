import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import type { AxiosResponse } from "axios";

// Simple in-memory dedupe/cache for identical endpoint requests during a
// single app lifecycle. This prevents duplicate network calls when the same
// endpoint is requested multiple times (e.g. React StrictMode double-mount
// or multiple components requesting the same data).
const inflightRequests = new Map<string, Promise<AxiosResponse<unknown>>>();
const responseCache = new Map<string, unknown>();

/**
 * Simple hook to call the local `/api/github?endpoint=...` proxy route.
 *
 * Usage:
 * const { data, loading, error, refetch } = useGithub('repos/nelaka/repo-name')
 */
export function useGithub(endpoint?: string | null) {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<Error | null>(null);
  // initialize loading to true when an endpoint is provided so skeletons
  // render immediately on mount rather than briefly showing an empty state
  const [loading, setLoading] = useState<boolean>(!!endpoint);

  const fetcher = useCallback(async (ep?: string | null) => {
    if (!ep) return;
    setLoading(true);
    setError(null);
    try {
      // Check cache first
      if (responseCache.has(ep)) {
        setData(responseCache.get(ep));
        return;
      }

      // If an identical request is already in-flight, await it instead of
      // issuing a second network call.
      let promise = inflightRequests.get(ep);
      if (!promise) {
        promise = axios
          .get("/api/github-rest", { params: { endpoint: ep } })
          .then((res) => {
            // store in cache for future callers
            responseCache.set(ep, res.data);
            inflightRequests.delete(ep);
            return res;
          })
          .catch((err) => {
            inflightRequests.delete(ep);
            throw err;
          });
        inflightRequests.set(ep, promise);
      }

      const res = await promise;
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
