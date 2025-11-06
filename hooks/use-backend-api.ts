import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/contexts/user-context";
import type { UseBackendApiOptions, UseBackendApiResponse } from "@/types";

// Simple in-memory cache for API responses
const apiCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Track rate limit state
const rateLimitState = {
  retryAfter: 0,
  lastRateLimitTime: 0,
};

/**
 * Check if we're currently rate limited
 */
function isRateLimited(): boolean {
  const now = Date.now();
  if (rateLimitState.retryAfter > now) {
    return true;
  }
  // Clear rate limit if enough time has passed
  if (now - rateLimitState.lastRateLimitTime > rateLimitState.retryAfter) {
    rateLimitState.retryAfter = 0;
  }
  return false;
}

/**
 * Update rate limit state from response headers or body
 */
function updateRateLimit(response: Response | { retryAfter?: number }): void {
  let retryAfter = 0;

  if (response instanceof Response) {
    const retryAfterHeader = response.headers.get("Retry-After");
    retryAfter = retryAfterHeader
      ? parseInt(retryAfterHeader, 10) * 1000
      : 60000;
  } else if (response.retryAfter) {
    retryAfter = response.retryAfter * 1000;
  }

  rateLimitState.retryAfter = Date.now() + retryAfter;
  rateLimitState.lastRateLimitTime = Date.now();
}

/**
 * Custom hook for making authenticated API calls to the backend service.
 *
 * Features:
 * - API key authentication
 * - Error handling and logging
 * - Loading state management
 * - Manual refetch capability
 * - Type-safe responses
 * - Support for enrichment requests (owner, name, scope, task)
 *
 * @template T - The type of data returned by the API
 * @param url - The API endpoint URL (relative or absolute)
 * @param options - Configuration options (method, body, headers, apiKey, etc.)
 * @returns Object with data, loading, error, and refetch function
 *
 * @example
 * const { data, loading, error } = useBackendApi<{ analysis: string }>(
 *   "/api/enrichment",
 *   {
 *     method: "POST",
 *     body: {
 *       owner: "facebook",
 *       name: "react",
 *       scope: "repo",
 *       task: "analyze",
 *     },
 *     apiKey: process.env.NEXT_PUBLIC_API_KEY,
 *   }
 * );
 */
export function useBackendApi<T = unknown>(
  url: string | null,
  options: UseBackendApiOptions = {}
): UseBackendApiResponse<T> {
  const { user } = useUser();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    skip = false,
    method = "GET",
    headers: customHeaders = {},
    body,
    cache = "default",
    apiKey,
  } = options;

  const fetchData = useCallback(async () => {
    // Skip if no URL or skip flag is true
    if (!url || skip) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build headers with API key authentication
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...customHeaders,
      };

      // Add API key if provided
      if (apiKey) {
        headers["X-API-Key"] = apiKey;
      }

      // Add GitHub username if available (for server-side context)
      if (user?.login) {
        headers["X-GitHub-User"] = user.login;
      }

      // Build fetch URL - prepend backend host if relative URL
      const baseUrl =
        process.env.PULSE_API_BASE_URL || "http://localhost:3000/api";
      const fetchUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

      // Check cache for GET requests
      if (method === "GET") {
        const cached = apiCache.get(fetchUrl);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          setData(cached.data as T);
          setLoading(false);
          return;
        }
      }

      // Check rate limit before making request
      if (isRateLimited()) {
        const waitTime = Math.ceil(
          (rateLimitState.retryAfter - Date.now()) / 1000
        );
        throw new Error(`Rate limited. Please retry after ${waitTime} seconds`);
      }

      // Build fetch options
      const fetchOptions: RequestInit = {
        method,
        headers,
        cache: cache as RequestCache,
      };

      // Add body if present
      if (body) {
        fetchOptions.body = JSON.stringify(body);
      }

      // Make the request
      const response = await fetch(fetchUrl, fetchOptions);

      // Handle rate limiting (429)
      if (response.status === 429) {
        updateRateLimit(response);
        const retryAfterHeader = response.headers.get("Retry-After");
        const retryAfter = retryAfterHeader
          ? parseInt(retryAfterHeader, 10)
          : 60;
        throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);
      }

      // Handle non-2xx responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Check for rate limit in response body
        if (errorData.retryAfter) {
          updateRateLimit(errorData);
        }

        throw new Error(
          errorData.message ||
            `API Error: ${response.status} ${response.statusText}`
        );
      }

      // Parse and return response data
      const result: T = await response.json();

      // Cache GET requests
      if (method === "GET") {
        apiCache.set(fetchUrl, {
          data: result,
          timestamp: Date.now(),
        });
      }

      setData(result);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setData(null);
      console.error(`Backend API error (${method} ${url}):`, error);
    } finally {
      setLoading(false);
    }
  }, [url, skip, method, body, customHeaders, cache, apiKey, user?.login]);

  // Auto-fetch on mount or when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Helper function to make a single backend API call without React hook overhead.
 * Useful for imperative calls like form submissions.
 *
 * @template T - The type of data returned by the API
 * @param url - The API endpoint URL
 * @param options - Configuration options (method, body, headers, apiKey, etc.)
 * @returns Promise resolving to the response data
 *
 * @example
 * const result = await callBackendApi<{ analysis: string }>(
 *   "/api/enrichment",
 *   {
 *     method: "POST",
 *     body: {
 *       owner: "facebook",
 *       name: "react",
 *       scope: "repo",
 *       task: "analyze",
 *     },
 *     apiKey: process.env.NEXT_PUBLIC_API_KEY,
 *   }
 * );
 */
export async function callBackendApi<T = unknown>(
  url: string,
  options: Omit<UseBackendApiOptions, "skip"> = {}
): Promise<T> {
  const {
    method = "GET",
    headers: customHeaders = {},
    body,
    cache = "default",
    apiKey,
  } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const fetchUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

  const fetchOptions: RequestInit = {
    method,
    headers,
    cache: cache as RequestCache,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(fetchUrl, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}
