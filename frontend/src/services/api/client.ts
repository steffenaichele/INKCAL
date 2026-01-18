// Base URL configuration - uses environment variable or defaults to /api
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Custom API Error class with status code
 */
export class ApiError extends Error {
  message: string;
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.message = message;
    this.status = status;
  }
}

/**
 * Type-safe fetch wrapper for all API requests
 *
 * @param endpoint - API endpoint (e.g., '/users', '/appointments/123')
 * @param options - Standard fetch options (method, body, headers, etc.)
 * @returns Parsed JSON response
 * @throws ApiError if request fails
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred'
    }));
    throw new ApiError(
      error.message || 'Request failed',
      response.status
    );
  }

  // For DELETE requests that return no content
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return response.json();
}
