/**
 * API Client Utility - Base API client with error handling and retry logic
 * 
 * Provides a centralized API client for making HTTP requests to the backend.
 * Includes automatic retry logic, error classification, and response parsing.
 */

/**
 * API Configuration
 */
const API_BASE_URL = import.meta.env['VITE_API_BASE_URL'] || '/api';
const DEFAULT_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Custom error class for API errors with detailed information.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errorCode?: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Determines if the error is a network error that can be retried.
   */
  isRetryable(): boolean {
    return this.statusCode >= 500 || this.statusCode === 0;
  }
}

/**
 * Request options for API calls.
 */
export interface RequestOptions {
  /** HTTP method (GET, POST, PUT, DELETE, etc.) */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  
  /** Request headers */
  headers?: Record<string, string>;
  
  /** Request body (will be JSON stringified) */
  body?: unknown;
  
  /** Request timeout in milliseconds */
  timeout?: number;
  
  /** Number of retry attempts for failed requests */
  retries?: number;
  
  /** Whether to include credentials (cookies) */
  credentials?: RequestCredentials;
}

/**
 * Waits for a specified delay.
 * 
 * @param ms - Milliseconds to wait
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a fetch request with timeout support.
 * 
 * @param url - Request URL
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Parses the response body based on content type.
 * 
 * @param response - Fetch Response object
 */
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    return response.json() as Promise<T>;
  }
  
  // For non-JSON responses, return text wrapped in an object
  const text = await response.text();
  return { data: text } as unknown as T;
}

/**
 * Makes an API request with automatic retries and error handling.
 * 
 * @param endpoint - API endpoint (will be appended to base URL)
 * @param options - Request options
 * @returns Promise resolving to the response data
 * @throws ApiError if the request fails after all retries
 * 
 * @example
 * // GET request
 * const data = await apiRequest<MenuApiResponse>('/menu');
 * 
 * @example
 * // POST request with body
 * const result = await apiRequest<OrderResponse>('/orders', {
 *   method: 'POST',
 *   body: { items: [...] }
 * });
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = DEFAULT_TIMEOUT,
    retries = MAX_RETRIES,
    credentials = 'same-origin',
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...headers,
  };

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials,
  };

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  let lastError: ApiError | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions, timeout);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorDetails: Record<string, unknown> | undefined;
        let errorCode: string | undefined;

        try {
          const errorBody = await response.json() as { 
            message?: string; 
            error?: string;
            code?: string;
            details?: Record<string, unknown>;
          };
          errorMessage = errorBody.message || errorBody.error || errorMessage;
          errorCode = errorBody.code;
          errorDetails = errorBody.details;
        } catch {
          // Response body is not JSON, use default message
        }

        throw new ApiError(errorMessage, response.status, errorCode, errorDetails);
      }

      return parseResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        lastError = error;
        
        // Only retry on retryable errors
        if (error.isRetryable() && attempt < retries) {
          await delay(RETRY_DELAY * (attempt + 1)); // Exponential backoff
          continue;
        }
        
        throw error;
      }

      // Handle network errors and timeouts
      if (error instanceof Error) {
        const isTimeout = error.name === 'AbortError';
        const statusCode = isTimeout ? 408 : 0;
        const message = isTimeout 
          ? 'Request timed out' 
          : `Network error: ${error.message}`;
        
        lastError = new ApiError(message, statusCode);
        
        if (attempt < retries) {
          await delay(RETRY_DELAY * (attempt + 1));
          continue;
        }
        
        throw lastError;
      }

      throw new ApiError('An unexpected error occurred', 0);
    }
  }

  // This should not be reached, but TypeScript requires a return
  throw lastError || new ApiError('Request failed after retries', 0);
}

/**
 * Convenience function for GET requests.
 * 
 * @param endpoint - API endpoint
 * @param options - Request options (method will be overridden)
 */
export function get<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * Convenience function for POST requests.
 * 
 * @param endpoint - API endpoint
 * @param body - Request body
 * @param options - Request options (method will be overridden)
 */
export function post<T>(
  endpoint: string, 
  body: unknown, 
  options?: Omit<RequestOptions, 'method' | 'body'>
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: 'POST', body });
}

/**
 * Convenience function for PUT requests.
 * 
 * @param endpoint - API endpoint
 * @param body - Request body
 * @param options - Request options (method will be overridden)
 */
export function put<T>(
  endpoint: string, 
  body: unknown, 
  options?: Omit<RequestOptions, 'method' | 'body'>
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: 'PUT', body });
}

/**
 * Convenience function for DELETE requests.
 * 
 * @param endpoint - API endpoint
 * @param options - Request options (method will be overridden)
 */
export function del<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
}
