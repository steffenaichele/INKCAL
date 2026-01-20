import { useMemo, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context';
import { workdaysApi } from '@/services/api/workdays';
import type { DayConfig } from '@/types/api';
import { parseTimeToMinutes, addHoursToTime } from '@/utils/calendar';
import { CalendarConfigContext, type CalendarConfig } from './CalendarConfigContext';

// Default workdays configuration (Monday-Friday 9-5, weekends off)
const DEFAULT_WORKDAYS: DayConfig[] = [
  { dayOfWeek: 'monday', isWorkday: true, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 'tuesday', isWorkday: true, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 'wednesday', isWorkday: true, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 'thursday', isWorkday: true, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 'friday', isWorkday: true, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 'saturday', isWorkday: false, startTime: '00:00', endTime: '23:59' },
  { dayOfWeek: 'sunday', isWorkday: false, startTime: '00:00', endTime: '23:59' },
];

/**
 * Calculate calendar configuration from workdays
 */
function calculateCalendarConfig(workdays: DayConfig[]): CalendarConfig {
  // Find earliest start and latest end across all workdays
  let earliestStart = '23:59';
  let latestEnd = '00:00';

  workdays.forEach(day => {
    if (day.isWorkday) {
      const startMinutes = parseTimeToMinutes(day.startTime);
      const endMinutes = parseTimeToMinutes(day.endTime);

      if (startMinutes < parseTimeToMinutes(earliestStart)) {
        earliestStart = day.startTime;
      }
      if (endMinutes > parseTimeToMinutes(latestEnd)) {
        latestEnd = day.endTime;
      }
    }
  });

  // If no workdays found, default to 9 AM - 5 PM
  if (earliestStart === '23:59' && latestEnd === '00:00') {
    earliestStart = '09:00';
    latestEnd = '17:00';
  }

  // Store actual working hours
  const workingStartTime = earliestStart;
  const workingEndTime = latestEnd;

  // Add buffer hours (1 hour before and after)
  const displayStartTime = addHoursToTime(earliestStart, -1);
  const displayEndTime = addHoursToTime(latestEnd, 1);

  // Calculate total 15-minute blocks
  const startMinutes = parseTimeToMinutes(displayStartTime);
  const endMinutes = parseTimeToMinutes(displayEndTime);
  const durationMinutes = endMinutes - startMinutes;
  const totalBlocks = durationMinutes / 15;

  return {
    displayStartTime,
    displayEndTime,
    workingStartTime,
    workingEndTime,
    totalBlocks,
    blockDuration: 15,
    workdays,
  };
}

const CalendarConfigProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  // Fetch workdays configuration
  const { data: workdays, isLoading } = useQuery({
    queryKey: ['workdays', user?._id],
    queryFn: () => workdaysApi.getByUserId(user!._id),
    enabled: !!user,
  });

  // Calculate calendar config from workdays
  const config = useMemo(() => {
    if (!workdays?.workdays || workdays.workdays.length === 0) {
      // Use default workdays
      return calculateCalendarConfig(DEFAULT_WORKDAYS);
    }
    return calculateCalendarConfig(workdays.workdays);
  }, [workdays]);

  const value = {
    config,
    isLoading,
  };

  return (
    <CalendarConfigContext value={value}>
      {children}
    </CalendarConfigContext>
  );
};

export default CalendarConfigProvider;
