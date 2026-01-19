/**
 * API Client Utilities
 * Helper functions for making API requests
 */

/**
 * Base API URL from environment variable
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Default request timeout in milliseconds
 */
const DEFAULT_TIMEOUT = 30000;

/**
 * API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Request options interface
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeout?: number;
}

/**
 * API response interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

/**
 * Create an AbortController with timeout
 */
function createAbortController(timeout: number): {
  controller: AbortController;
  timeoutId: ReturnType<typeof setTimeout>;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  return { controller, timeoutId };
}

/**
 * Get the authentication token from session storage
 */
function getAuthToken(): string | null {
  try {
    const authData = sessionStorage.getItem('auth-storage');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed?.state?.session?.token || null;
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
}

/**
 * Make an API request
 * @param endpoint - API endpoint (relative to base URL)
 * @param options - Request options
 * @returns Promise resolving to the response data
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    body,
    headers: customHeaders,
    timeout = DEFAULT_TIMEOUT,
    ...restOptions
  } = options;

  const { controller, timeoutId } = createAbortController(timeout);

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders,
    };

    const response = await fetch(url, {
      ...restOptions,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred',
        response.status,
        data.code,
        data.details
      );
    }

    return data as ApiResponse<T>;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT');
      }
      throw new ApiError(error.message, 500, 'NETWORK_ERROR');
    }

    throw new ApiError('An unexpected error occurred', 500, 'UNKNOWN_ERROR');
  }
}

/**
 * GET request helper
 */
export async function get<T>(
  endpoint: string,
  options?: Omit<RequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * POST request helper
 */
export async function post<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, 'method'>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: 'POST', body });
}

/**
 * PUT request helper
 */
export async function put<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, 'method'>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: 'PUT', body });
}

/**
 * PATCH request helper
 */
export async function patch<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, 'method'>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: 'PATCH', body });
}

/**
 * DELETE request helper
 */
export async function del<T>(
  endpoint: string,
  options?: Omit<RequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
}
