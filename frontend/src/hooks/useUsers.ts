import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../services/api';
import { queryKeys } from '../lib/query-keys';
import type { UserInput } from '../types/api';

/**
 * Query Hook: Get all users
 *
 * @returns Query result with users array, loading state, and error
 *
 * @example
 * const { data: users, isLoading, error } = useUsers();
 */
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.lists(),
    queryFn: () => usersApi.getAll(),
  });
}

/**
 * Query Hook: Get single user by ID
 *
 * @param userId - User ID to fetch
 * @returns Query result with user object, loading state, and error
 *
 * @example
 * const { data: user, isLoading, error } = useUser(userId);
 */
export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId!),
    queryFn: () => usersApi.getById(userId!),
    enabled: !!userId, // Only run query if userId is provided
  });
}

/**
 * Mutation Hook: Create a new user
 *
 * Automatically invalidates users list query on success
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * const createUser = useCreateUser();
 *
 * createUser.mutate({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'secure123'
 * }, {
 *   onSuccess: () => console.log('User created!'),
 *   onError: (error) => console.error(error.message)
 * });
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserInput) => usersApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}

/**
 * Mutation Hook: Update an existing user
 *
 * Automatically invalidates both list and detail queries on success
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * const updateUser = useUpdateUser();
 *
 * updateUser.mutate({
 *   id: '123',
 *   data: { name: 'Jane Doe', email: 'jane@example.com', password: 'secure456' }
 * });
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserInput }) =>
      usersApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      // Invalidate specific user detail
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
    },
  });
}

/**
 * Mutation Hook: Delete a user
 *
 * Automatically invalidates users list query on success
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * const deleteUser = useDeleteUser();
 *
 * deleteUser.mutate('user-id-123', {
 *   onSuccess: () => console.log('User deleted!')
 * });
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}
