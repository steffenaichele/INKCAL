import { apiFetch } from './client';
import type { Workdays, WorkdaysInput } from '@/types/api';

/**
 * Workdays API Service
 * Handles all workdays-related API calls
 */
export const workdaysApi = {
  /**
   * Get workdays configuration for a specific user
   * @param userId - User ID
   * @returns Workdays configuration object
   */
  getByUserId: (userId: string) =>
    apiFetch<Workdays>(`/workdays/${userId}`),

  /**
   * Create workdays configuration for a user
   * @param userId - User ID
   * @param data - Workdays configuration
   * @returns Created workdays configuration object
   */
  create: (userId: string, data: WorkdaysInput) =>
    apiFetch<Workdays>(`/workdays/${userId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Update workdays configuration for a user (upserts if doesn't exist)
   * @param userId - User ID
   * @param data - Updated workdays configuration
   * @returns Updated workdays configuration object
   */
  update: (userId: string, data: WorkdaysInput) =>
    apiFetch<Workdays>(`/workdays/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Delete workdays configuration for a user
   * @param userId - User ID
   * @returns void
   */
  delete: (userId: string) =>
    apiFetch<void>(`/workdays/${userId}`, {
      method: 'DELETE',
    }),
};
