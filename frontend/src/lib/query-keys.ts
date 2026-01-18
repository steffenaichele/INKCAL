import type { AppointmentFilters } from '../services/api/appointments';

/**
 * Centralized Query Keys Factory
 *
 * Benefits:
 * - Type-safe query keys
 * - Centralized key management
 * - Easy cache invalidation
 * - Consistent key structure
 *
 * Structure follows best practices from TanStack Query docs:
 * - all: ['resource'] - base key for all queries of this type
 * - lists: ['resource', 'list'] - base key for list queries
 * - list(filters): ['resource', 'list', filters] - specific list with filters
 * - details: ['resource', 'detail'] - base key for detail queries
 * - detail(id): ['resource', 'detail', id] - specific detail query
 */
export const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    lists: () => [...queryKeys.appointments.all, 'list'] as const,
    list: (filters?: AppointmentFilters) =>
      [...queryKeys.appointments.lists(), filters] as const,
    details: () => [...queryKeys.appointments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.appointments.details(), id] as const,
  },
} as const;
