import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi, type AppointmentFilters } from '../services/api';
import { queryKeys } from '../lib/query-keys';
import type { AppointmentInput } from '../types/api';

/**
 * Query Hook: Get all appointments with optional filters
 *
 * @param filters - Optional filters (userId, appointmentType)
 * @returns Query result with appointments array, loading state, and error
 *
 * @example
 * // Get all appointments
 * const { data: appointments } = useAppointments();
 *
 * // Filter by user
 * const { data: userAppointments } = useAppointments({ userId: '123' });
 *
 * // Filter by type
 * const { data: tattoos } = useAppointments({ appointmentType: 'NewTattoo' });
 *
 * // Filter by both
 * const { data: filtered } = useAppointments({
 *   userId: '123',
 *   appointmentType: 'Consultation'
 * });
 */
export function useAppointments(filters?: AppointmentFilters) {
  return useQuery({
    queryKey: queryKeys.appointments.list(filters),
    queryFn: () => appointmentsApi.getAll(filters),
  });
}

/**
 * Query Hook: Get single appointment by ID
 *
 * @param appointmentId - Appointment ID to fetch
 * @returns Query result with appointment object, loading state, and error
 *
 * @example
 * const { data: appointment, isLoading, error } = useAppointment(appointmentId);
 */
export function useAppointment(appointmentId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.appointments.detail(appointmentId!),
    queryFn: () => appointmentsApi.getById(appointmentId!),
    enabled: !!appointmentId, // Only run query if appointmentId is provided
  });
}

/**
 * Mutation Hook: Create a new appointment
 *
 * Automatically invalidates appointments list queries on success
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * const createAppointment = useCreateAppointment();
 *
 * createAppointment.mutate({
 *   appointmentType: 'NewTattoo',
 *   userId: '123',
 *   date: '2026-02-15',
 *   title: 'Dragon Sleeve',
 *   startTime: '10:00',
 *   endTime: '14:00',
 *   clientName: 'John Doe',
 *   designDescription: 'Full sleeve dragon with cherry blossoms',
 *   contact: {
 *     contactType: 'Instagram',
 *     contactValue: '@johndoe'
 *   }
 * }, {
 *   onSuccess: () => console.log('Appointment created!'),
 *   onError: (error) => console.error(error.message)
 * });
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AppointmentInput) => appointmentsApi.create(data),
    onSuccess: () => {
      // Invalidate all appointment list queries (with any filters)
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
    },
  });
}

/**
 * Mutation Hook: Update an existing appointment
 *
 * Automatically invalidates both list and detail queries on success
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * const updateAppointment = useUpdateAppointment();
 *
 * updateAppointment.mutate({
 *   id: 'appointment-123',
 *   data: {
 *     appointmentType: 'NewTattoo',
 *     userId: '123',
 *     date: '2026-02-15',
 *     title: 'Updated Title',
 *     startTime: '11:00',
 *     endTime: '15:00',
 *     clientName: 'John Doe',
 *     designDescription: 'Updated description',
 *     contact: { contactType: 'Instagram', contactValue: '@johndoe' }
 *   }
 * });
 */
export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AppointmentInput }) =>
      appointmentsApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate all appointment lists
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
      // Invalidate specific appointment detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.detail(variables.id),
      });
    },
  });
}

/**
 * Mutation Hook: Delete an appointment
 *
 * Automatically invalidates appointments list queries on success
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * const deleteAppointment = useDeleteAppointment();
 *
 * deleteAppointment.mutate('appointment-id-123', {
 *   onSuccess: () => console.log('Appointment deleted!')
 * });
 */
export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentsApi.delete(id),
    onSuccess: () => {
      // Invalidate all appointment lists
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
    },
  });
}
