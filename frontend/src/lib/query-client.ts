import { QueryClient } from '@tanstack/react-query';

/**
 * React Query Client Configuration
 *
 * Default options:
 * - staleTime: 5 minutes - data considered fresh for 5 minutes
 * - gcTime: 10 minutes - unused data garbage collected after 10 minutes
 * - retry: 1 - retry failed requests once
 * - refetchOnWindowFocus: false - don't refetch when window regains focus
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime in v4)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
