import { QueryClient } from "@tanstack/react-query";

/**
 * React Query Client Configuration
 *
 * Optimized for Vercel deployment with smart retry logic and error handling
 *
 * Default options:
 * - staleTime: 5 minutes - data considered fresh for 5 minutes
 * - gcTime: 10 minutes - unused data garbage collected after 10 minutes
 * - retry: Smart retry - don't retry on 4xx errors, retry up to 2 times on 5xx
 * - refetchOnWindowFocus: false - don't refetch when window regains focus
 * - refetchOnReconnect: true - refetch when internet reconnects
 */
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime in v4)
			retry: (failureCount, error) => {
				// Don't retry on 4xx errors (client errors)
				if (error instanceof Error && "status" in error) {
					const status = (error as { status?: number }).status;
					if (status && status >= 400 && status < 500) return false;
				}
				// Retry up to 2 times on 5xx errors
				return failureCount < 2;
			},
			refetchOnWindowFocus: false,
			refetchOnReconnect: true, // Refetch when internet reconnects
			refetchOnMount: true, // Enable request deduplication
		},
		mutations: {
			retry: 0, // Don't retry mutations by default
			// Global error handler for mutations
			onError: (error) => {
				console.error("Mutation error:", error);
			},
		},
	},
});
