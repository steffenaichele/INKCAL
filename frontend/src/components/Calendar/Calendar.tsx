import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Appointment, DayConfig } from '@/types/api';
import { workdaysApi } from '@/services/api/workdays';
import { appointmentsApi } from '@/services/api/appointments';
import Week from './Week';
import Icon from '@/components/Icon';
import { getMonday, addDays, formatMonthYear } from '@/utils/calendar';
import './Calendar.scss';

export interface CalendarProps {
  userId: string;
  onAppointmentClick?: (appointment: Appointment) => void;
}

// Default workdays configuration (Monday-Friday as working days, weekends off)
const DEFAULT_WORKDAYS: DayConfig[] = [
  { dayOfWeek: 'monday', isWorkday: true, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 'tuesday', isWorkday: true, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 'wednesday', isWorkday: true, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 'thursday', isWorkday: true, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 'friday', isWorkday: true, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 'saturday', isWorkday: false, startTime: '00:00', endTime: '23:59' },
  { dayOfWeek: 'sunday', isWorkday: false, startTime: '00:00', endTime: '23:59' },
];

const Calendar = ({ userId, onAppointmentClick }: CalendarProps) => {
  // Current week state (Monday of the week)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));

  // Fetch workdays configuration
  const { data: workdays, isLoading: loadingWorkdays, error: workdaysError } = useQuery({
    queryKey: ['workdays', userId],
    queryFn: () => workdaysApi.getByUserId(userId),
    enabled: !!userId,
  });

  // Fetch appointments
  const { data: appointments, isLoading: loadingAppointments, error: appointmentsError } = useQuery({
    queryKey: ['appointments', userId],
    queryFn: () => appointmentsApi.getAll({ userId }),
    enabled: !!userId,
  });

  // Use configured workdays or fall back to defaults
  const effectiveWorkdays = useMemo(() => {
    if (workdays && workdays.workdays && workdays.workdays.length > 0) {
      return workdays.workdays;
    }
    return DEFAULT_WORKDAYS;
  }, [workdays]);

  // Calculate current month/year display
  const monthYear = useMemo(() => {
    return formatMonthYear(currentWeekStart);
  }, [currentWeekStart]);

  // Navigation handlers
  const handlePreviousWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  const handleToday = () => {
    setCurrentWeekStart(getMonday(new Date()));
  };

  // Loading state
  if (loadingWorkdays || loadingAppointments) {
    return (
      <div className="calendar calendar--loading">
        <div className="calendar__loading">
          <Icon name="Clock" size={48} className="calendar__loading-icon" />
          <p>Loading calendar...</p>
        </div>
      </div>
    );
  }

  // Show error for appointments failure, but still display calendar with default workdays
  const hasAppointmentsError = !!appointmentsError;

  return (
    <div className="calendar">
      <div className="calendar__header">
        <div className="calendar__title-section">
          <h2 className="calendar__title">
            <Icon name="Calendar" size={24} className="calendar__title-icon" />
            <span>{monthYear}</span>
          </h2>
          {!workdays && !workdaysError && (
            <span className="calendar__default-notice">Using default schedule</span>
          )}
        </div>

        <div className="calendar__controls">
          <button
            className="calendar__control-btn"
            onClick={handlePreviousWeek}
            aria-label="Previous week"
            title="Previous week"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>

          <button
            className="calendar__today-btn"
            onClick={handleToday}
            aria-label="Go to current week"
          >
            Today
          </button>

          <button
            className="calendar__control-btn"
            onClick={handleNextWeek}
            aria-label="Next week"
            title="Next week"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>

      {hasAppointmentsError && (
        <div className="calendar__warning">
          <Icon name="AlertCircle" size={16} />
          <span>Unable to load appointments. Showing calendar only.</span>
        </div>
      )}

      <Week
        startDate={currentWeekStart}
        workdays={effectiveWorkdays}
        appointments={appointments || []}
        onAppointmentClick={onAppointmentClick}
      />
    </div>
  );
};

export default Calendar;
