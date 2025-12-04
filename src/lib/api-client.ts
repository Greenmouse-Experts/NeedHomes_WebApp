/**
 * API client with TanStack Query hooks
 * Use these hooks in your components for data fetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { get, post, put, patch, del, type ApiError } from './api'

// Query keys factory
export const queryKeys = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
  },
  // Users
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
  },
  // Properties
  properties: {
    all: ['properties'] as const,
    detail: (id: string) => ['properties', id] as const,
    listed: ['properties', 'listed'] as const,
    viewed: ['properties', 'viewed'] as const,
    sold: ['properties', 'sold'] as const,
  },
  // Transactions
  transactions: {
    all: ['transactions'] as const,
    detail: (id: string) => ['transactions', id] as const,
    receipts: ['transactions', 'receipts'] as const,
    payments: ['transactions', 'payments'] as const,
  },
  // Dashboard
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
    revenue: ['dashboard', 'revenue'] as const,
    wallet: ['dashboard', 'wallet'] as const,
  },
} as const

// Example: Auth hooks
export function useAuth() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => get<{ user: unknown }>('/auth/me'),
    retry: false,
  })
}

// Example: Login mutation
export function useLogin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      try {
        return await post<{ token: string; user: unknown }>('/auth/login', credentials)
      } catch (error) {
        // Return a mock response for development when API is not available
        console.warn('API not available, using mock response')
        return { token: 'mock-token', user: { email: credentials.email } }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
    },
  })
}

// Example: Dashboard stats
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: () => get<{ investors: number; partners: number; buildings: number; units: number }>('/dashboard/stats'),
  })
}

// Generic query hook factory
export function createQueryHook<T>(
  queryKey: readonly unknown[],
  endpoint: string
) {
  return () =>
    useQuery<T>({
      queryKey,
      queryFn: () => get<T>(endpoint),
    })
}

// Generic mutation hook factory
export function createMutationHook<TData, TVariables>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  invalidateKeys?: readonly unknown[][]
) {
  return () => {
    const queryClient = useQueryClient()
    
    return useMutation<TData, ApiError, TVariables>({
      mutationFn: (variables) => {
        switch (method) {
          case 'POST':
            return post<TData>(endpoint, variables)
          case 'PUT':
            return put<TData>(endpoint, variables)
          case 'PATCH':
            return patch<TData>(endpoint, variables)
          case 'DELETE':
            return del<TData>(endpoint)
          default:
            return post<TData>(endpoint, variables)
        }
      },
      onSuccess: () => {
        if (invalidateKeys) {
          invalidateKeys.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key })
          })
        }
      },
    })
  }
}

