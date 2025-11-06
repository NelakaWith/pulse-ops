import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/contexts/user-context";
import type { UseBackendApiOptions, UseBackendApiResponse } from "@/types";

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

      // Build fetch URL
      const fetchUrl = url.startsWith("http") ? url : `${url}`;

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

      // Handle non-2xx responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `API Error: ${response.status} ${response.statusText}`
        );
      }

      // Parse and return response data
      const result: T = await response.json();
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

  const fetchUrl = url.startsWith("http") ? url : `${url}`;

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
