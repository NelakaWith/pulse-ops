/**
 * API request and response types for backend communication
 */

export interface EnrichmentRequest {
  owner: string;
  name: string;
  scope: "repo" | "user" | "org";
  task: string;
  payload?: Record<string, unknown>;
}

export interface UseBackendApiOptions {
  skip?: boolean;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  cache?: "no-cache" | "default" | "force-cache";
  apiKey?: string;
}

export interface UseBackendApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Generic API response wrapper for backend endpoints
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Common error response from backend
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
