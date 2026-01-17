import { apiFetch } from './client';
import type { User, UserInput } from '../../types/api';

/**
 * Users API service
 * Provides all CRUD operations for user resources
 */
export const usersApi = {
  /**
   * Get all users
   * @returns Array of all users
   */
  getAll: () => apiFetch<User[]>('/users'),

  /**
   * Get a single user by ID
   * @param id - User ID
   * @returns User object
   */
  getById: (id: string) => apiFetch<User>(`/users/${id}`),

  /**
   * Create a new user
   * @param data - User data (name, email, password)
   * @returns Created user object
   */
  create: (data: UserInput) =>
    apiFetch<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Update an existing user
   * @param id - User ID
   * @param data - Updated user data
   * @returns Updated user object
   */
  update: (id: string, data: UserInput) =>
    apiFetch<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Delete a user
   * @param id - User ID
   * @returns void
   */
  delete: (id: string) =>
    apiFetch<void>(`/users/${id}`, {
      method: 'DELETE',
    }),
};
