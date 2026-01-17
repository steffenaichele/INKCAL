import { apiFetch } from './client';
import type { Appointment, AppointmentInput, AppointmentType } from '../../types/api';

/**
 * Query filters for appointments
 */
export interface AppointmentFilters {
  userId?: string;
  appointmentType?: AppointmentType;
}

/**
 * Appointments API service
 * Provides all CRUD operations for appointment resources
 */
export const appointmentsApi = {
  /**
   * Get all appointments with optional filters
   * @param filters - Optional filters (userId, appointmentType)
   * @returns Array of appointments
   */
  getAll: (filters?: AppointmentFilters) => {
    const params = new URLSearchParams();
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.appointmentType) params.append('appointmentType', filters.appointmentType);

    const query = params.toString();
    return apiFetch<Appointment[]>(`/appointments${query ? `?${query}` : ''}`);
  },

  /**
   * Get a single appointment by ID
   * @param id - Appointment ID
   * @returns Appointment object
   */
  getById: (id: string) => apiFetch<Appointment>(`/appointments/${id}`),

  /**
   * Create a new appointment
   * @param data - Appointment data (must include appointmentType)
   * @returns Created appointment object
   */
  create: (data: AppointmentInput) =>
    apiFetch<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Update an existing appointment
   * @param id - Appointment ID
   * @param data - Updated appointment data
   * @returns Updated appointment object
   */
  update: (id: string, data: AppointmentInput) =>
    apiFetch<Appointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Delete an appointment
   * @param id - Appointment ID
   * @returns void
   */
  delete: (id: string) =>
    apiFetch<void>(`/appointments/${id}`, {
      method: 'DELETE',
    }),
};
