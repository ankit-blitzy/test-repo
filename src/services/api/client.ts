/**
 * Axios HTTP client configuration with interceptors.
 * Provides a pre-configured API client for all service modules.
 * Attaches authentication tokens and handles common response patterns.
 */

import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from '@/utils/constants';
import { getSessionStorageItem } from '@/services/storage/sessionStorage';
import type { ApiError } from '@/types/api.types';

/**
 * Creates and configures the Axios client instance.
 * - Sets base URL from environment configuration
 * - Configures request timeout
 * - Attaches auth token interceptor
 * - Normalizes error responses
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor: Attaches the access token from session storage
 * to every outgoing request's Authorization header.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getSessionStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Unwraps successful responses and normalizes errors
 * into a consistent ApiError shape for consumers.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
    };

    if (error.response?.data && typeof error.response.data === 'object') {
      const errorData = error.response.data as Record<string, unknown>;
      if (typeof errorData.message === 'string') {
        apiError.message = errorData.message;
      }
      if (errorData.details && typeof errorData.details === 'object') {
        apiError.details = errorData.details as Record<string, string[]>;
      }
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
