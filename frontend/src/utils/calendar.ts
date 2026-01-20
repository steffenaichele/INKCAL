import type { Appointment, DayOfWeek } from '@/types/api';

// ============================================================================
// Date Manipulation Utilities
// ============================================================================

/**
 * Get the Monday of the week containing the given date
 * @param date - Any date in the week
 * @returns The Monday of that week
 */
export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Get an array of 7 dates starting from the given date (Monday)
 * @param startDate - Starting date (should be Monday)
 * @returns Array of 7 dates (Monday through Sunday)
 */
export function getWeekDates(startDate: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
}

/**
 * Format a date to weekday name
 * @param date - Date to format
 * @returns Weekday name (e.g., "Monday")
 */
export function formatWeekday(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Format a date to short weekday name
 * @param date - Date to format
 * @returns Short weekday name (e.g., "Mon")
 */
export function formatWeekdayShort(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Format a date to readable format
 * @param date - Date to format
 * @returns Formatted date (e.g., "Jan 20, 2026")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format a date to short format
 * @param date - Date to format
 * @returns Formatted date (e.g., "Jan 20")
 */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format a date to ISO date string (YYYY-MM-DD)
 * @param date - Date to format
 * @returns ISO date string
 */
export function formatISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Check if two dates are the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns True if date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Get the day of week name from a Date object
 * @param date - Date object
 * @returns Day of week name (lowercase)
 */
export function getDayOfWeek(date: Date): DayOfWeek {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
}

/**
 * Add days to a date
 * @param date - Starting date
 * @param days - Number of days to add (can be negative)
 * @returns New date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get the month and year from a date
 * @param date - Date object
 * @returns Formatted month and year (e.g., "January 2026")
 */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// ============================================================================
// Time Utilities
// ============================================================================

/**
 * Parse time string (HH:mm) to minutes since midnight
 * @param time - Time string in HH:mm format
 * @returns Total minutes since midnight
 */
export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Format minutes to HH:mm time string
 * @param minutes - Total minutes since midnight
 * @returns Time string in HH:mm format
 */
export function formatMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Add or subtract hours from a time string
 * @param time - Time string in HH:mm format
 * @param hours - Number of hours to add (can be negative)
 * @returns New time string in HH:mm format
 */
export function addHoursToTime(time: string, hours: number): string {
  const minutes = parseTimeToMinutes(time);
  const newMinutes = Math.max(0, Math.min(1440, minutes + (hours * 60))); // Clamp to 0-1440 (24 hours)
  return formatMinutesToTime(newMinutes);
}

/**
 * Get array of hour strings between start and end times
 * @param startTime - Start time in HH:mm format
 * @param endTime - End time in HH:mm format
 * @returns Array of hour strings (e.g., ["09:00", "10:00", "11:00"])
 */
export function getHoursBetween(startTime: string, endTime: string): string[] {
  const startMinutes = parseTimeToMinutes(startTime);
  let endMinutes = parseTimeToMinutes(endTime);

  // Handle special case where end time is 23:59 (treat as full day)
  if (endTime === '23:59') {
    endMinutes = 24 * 60;
  }

  const hours: string[] = [];
  for (let minutes = startMinutes; minutes < endMinutes; minutes += 60) {
    hours.push(formatMinutesToTime(minutes));
  }

  return hours;
}

/**
 * Calculate the percentage position of an appointment start time within an hour slot
 * @param appointmentStartTime - Appointment start time (HH:mm)
 * @param hourStart - Hour slot start time (HH:mm)
 * @returns Percentage offset (0-100)
 */
export function calculateAppointmentPosition(
  appointmentStartTime: string,
  hourStart: string
): number {
  const appointmentMinutes = parseTimeToMinutes(appointmentStartTime);
  const hourStartMinutes = parseTimeToMinutes(hourStart);

  // Calculate minutes offset within the hour
  const minutesOffset = appointmentMinutes - hourStartMinutes;

  // Convert to percentage of an hour (60 minutes)
  return (minutesOffset / 60) * 100;
}

/**
 * Calculate the height percentage of an appointment
 * @param startTime - Appointment start time (HH:mm)
 * @param endTime - Appointment end time (HH:mm)
 * @returns Height as percentage of hour slots
 */
export function calculateAppointmentHeight(
  startTime: string,
  endTime: string
): number {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  const durationMinutes = endMinutes - startMinutes;

  // Each hour is 100%, so duration in hours * 100
  return (durationMinutes / 60) * 100;
}

/**
 * Find which hour slot an appointment starts in
 * @param appointmentStartTime - Appointment start time (HH:mm)
 * @param hours - Array of hour strings
 * @returns Index of the hour slot (0-based)
 */
export function findHourSlotIndex(
  appointmentStartTime: string,
  hours: string[]
): number {
  const appointmentMinutes = parseTimeToMinutes(appointmentStartTime);

  for (let i = 0; i < hours.length; i++) {
    const hourMinutes = parseTimeToMinutes(hours[i]);
    const nextHourMinutes = hourMinutes + 60;

    if (appointmentMinutes >= hourMinutes && appointmentMinutes < nextHourMinutes) {
      return i;
    }
  }

  return 0; // Default to first hour if not found
}

// ============================================================================
// Appointment Utilities
// ============================================================================

/**
 * Filter appointments for a specific day
 * @param appointments - Array of all appointments
 * @param date - Date to filter for
 * @returns Array of appointments for that day
 */
export function getAppointmentsForDay(
  appointments: Appointment[],
  date: Date
): Appointment[] {
  const targetDateStr = formatISODate(date);

  return appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const appointmentDateStr = formatISODate(appointmentDate);
    return appointmentDateStr === targetDateStr;
  });
}

/**
 * Sort appointments by start time
 * @param appointments - Array of appointments
 * @returns Sorted array of appointments
 */
export function sortAppointmentsByTime(appointments: Appointment[]): Appointment[] {
  return [...appointments].sort((a, b) => {
    const aMinutes = parseTimeToMinutes(a.startTime);
    const bMinutes = parseTimeToMinutes(b.startTime);
    return aMinutes - bMinutes;
  });
}

/**
 * Check if two appointments overlap
 * @param apt1 - First appointment
 * @param apt2 - Second appointment
 * @returns True if appointments overlap
 */
export function appointmentsOverlap(apt1: Appointment, apt2: Appointment): boolean {
  // Check if they're on the same day
  if (apt1.date !== apt2.date) {
    return false;
  }

  const start1 = parseTimeToMinutes(apt1.startTime);
  const end1 = parseTimeToMinutes(apt1.endTime);
  const start2 = parseTimeToMinutes(apt2.startTime);
  const end2 = parseTimeToMinutes(apt2.endTime);

  // Check for overlap
  return start1 < end2 && start2 < end1;
}

/**
 * Group overlapping appointments together
 * @param appointments - Array of appointments for a day (should be sorted)
 * @returns Array of appointment groups
 */
export function groupOverlappingAppointments(
  appointments: Appointment[]
): Appointment[][] {
  if (appointments.length === 0) return [];

  const sorted = sortAppointmentsByTime(appointments);
  const groups: Appointment[][] = [];
  let currentGroup: Appointment[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const overlapsWithGroup = currentGroup.some(apt => appointmentsOverlap(apt, current));

    if (overlapsWithGroup) {
      currentGroup.push(current);
    } else {
      groups.push(currentGroup);
      currentGroup = [current];
    }
  }

  groups.push(currentGroup);
  return groups;
}

/**
 * Get the color for an appointment type
 * @param appointmentType - Type of appointment
 * @returns Color hex code
 */
export function getAppointmentTypeColor(appointmentType: string): string {
  switch (appointmentType) {
    case 'NewTattoo':
      return '#4caf50';
    case 'TouchUp':
      return '#2196f3';
    case 'Consultation':
      return '#ff9800';
    case 'Blocker':
      return '#9e9e9e';
    default:
      return '#757575';
  }
}

// ============================================================================
// Block-Based Grid Utilities (15-minute blocks)
// ============================================================================

/**
 * Calculate grid row position for appointment using 15-minute blocks
 * @param appointmentTime - Appointment time (HH:mm)
 * @param displayStartTime - Display start time (HH:mm)
 * @param blockDuration - Duration of each block in minutes (default: 15)
 * @returns Grid row position (1-indexed)
 */
export function calculateBlockPosition(
  appointmentTime: string,
  displayStartTime: string,
  blockDuration: number = 15
): number {
  const appointmentMinutes = parseTimeToMinutes(appointmentTime);
  const displayStartMinutes = parseTimeToMinutes(displayStartTime);
  const offsetMinutes = appointmentMinutes - displayStartMinutes;
  return Math.floor(offsetMinutes / blockDuration) + 1; // +1 for 1-indexed grid
}

/**
 * Calculate grid row span for appointment duration
 * @param startTime - Appointment start time (HH:mm)
 * @param endTime - Appointment end time (HH:mm)
 * @param blockDuration - Duration of each block in minutes (default: 15)
 * @returns Number of blocks to span
 */
export function calculateBlockSpan(
  startTime: string,
  endTime: string,
  blockDuration: number = 15
): number {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  const durationMinutes = endMinutes - startMinutes;
  return Math.ceil(durationMinutes / blockDuration);
}

/**
 * Generate time labels for 15-minute grid (only show on the hour)
 * @param startTime - Display start time (HH:mm)
 * @param endTime - Display end time (HH:mm)
 * @param blockDuration - Duration of each block in minutes (default: 15)
 * @returns Array of block labels with positions
 */
export function generateBlockLabels(
  startTime: string,
  endTime: string,
  blockDuration: number = 15
): Array<{ block: number; label: string | null }> {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  const totalBlocks = (endMinutes - startMinutes) / blockDuration;

  const labels: Array<{ block: number; label: string | null }> = [];

  for (let i = 0; i < totalBlocks; i++) {
    const currentMinutes = startMinutes + (i * blockDuration);
    const isHourMark = currentMinutes % 60 === 0;

    labels.push({
      block: i + 1,
      label: isHourMark ? formatMinutesToTime(currentMinutes) : null,
    });
  }

  return labels;
}

/**
 * Format date to API format (YYYY-MM-DD)
 * @param date - Date object
 * @returns Formatted date string
 */
export function formatDateForApi(date: Date): string {
  return formatISODate(date);
}
