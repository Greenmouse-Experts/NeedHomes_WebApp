/**
 * API utility for making requests with TanStack Query
 * This provides a centralized way to make API calls throughout the application
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export interface ApiError {
  message: string
  status?: number
}

/**
 * Generic API request function
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    // For development, don't throw errors for 404/500 if API doesn't exist
    if (response.status === 404 || response.status === 500) {
      console.warn(`API endpoint not found: ${url}`)
      // Return empty object instead of throwing for development
      return {} as T
    }
    
    const error: ApiError = {
      message: `API Error: ${response.statusText}`,
      status: response.status,
    }
    
    try {
      const errorData = await response.json()
      error.message = errorData.message || error.message
    } catch {
      // If response is not JSON, use default error message
    }
    
    throw error
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    return {} as T
  }

  return response.json()
}

/**
 * GET request helper
 */
export function get<T>(endpoint: string, options?: RequestInit): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'GET',
  })
}

/**
 * POST request helper
 */
export function post<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PUT request helper
 */
export function put<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PATCH request helper
 */
export function patch<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * DELETE request helper
 */
export function del<T>(endpoint: string, options?: RequestInit): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'DELETE',
  })
}

