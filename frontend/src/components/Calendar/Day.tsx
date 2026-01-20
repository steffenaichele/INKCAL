import { useMemo } from 'react';
import type { Appointment, DayConfig } from '@/types/api';
import AppointmentCard from './AppointmentCard';
import {
  formatWeekdayShort,
  formatDateShort,
  getAppointmentsForDay,
  sortAppointmentsByTime,
  findHourSlotIndex,
  calculateAppointmentPosition,
  calculateAppointmentHeight,
  groupOverlappingAppointments,
  isToday,
  parseTimeToMinutes,
} from '@/utils/calendar';
import './Day.scss';

export interface DayProps {
  date: Date;
  workdayConfig: DayConfig | null;
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
  weekStartTime: string;
  weekEndTime: string;
  weekHours: string[];
  workingStartTime: string;
  workingEndTime: string;
}

const Day = ({ date, workdayConfig, appointments, onAppointmentClick, weekHours, workingStartTime, workingEndTime }: DayProps) => {
  const weekday = formatWeekdayShort(date);
  const dateStr = formatDateShort(date);
  const today = isToday(date);

  // Filter and sort appointments for this day
  const dayAppointments = useMemo(() => {
    const filtered = getAppointmentsForDay(appointments, date);
    return sortAppointmentsByTime(filtered);
  }, [appointments, date]);

  // Use week-wide hours for consistent grid
  const hours = weekHours;

  // Group overlapping appointments
  const appointmentGroups = useMemo(() => {
    return groupOverlappingAppointments(dayAppointments);
  }, [dayAppointments]);

  // Calculate positions for appointments
  const appointmentPositions = useMemo(() => {
    const positions = new Map<string, { top: number; height: number; left: number; width: number }>();

    appointmentGroups.forEach(group => {
      const groupSize = group.length;

      group.forEach((appointment, index) => {
        const hourSlotIndex = findHourSlotIndex(appointment.startTime, hours);
        const hourStart = hours[hourSlotIndex] || hours[0];

        const positionInHour = calculateAppointmentPosition(appointment.startTime, hourStart);
        const top = hourSlotIndex * 100 + positionInHour;
        const height = calculateAppointmentHeight(appointment.startTime, appointment.endTime);

        // If overlapping, divide width and offset left
        const width = groupSize > 1 ? 100 / groupSize : 100;
        const left = index * width;

        positions.set(appointment._id, { top, height, left, width });
      });
    });

    return positions;
  }, [appointmentGroups, hours]);

  // Check if this is a non-workday
  const isNonWorkday = !workdayConfig || !workdayConfig.isWorkday;

  return (
    <div className={`calendar-day ${today ? 'calendar-day--today' : ''} ${isNonWorkday ? 'calendar-day--non-workday' : ''}`}>
      <div className="calendar-day__header">
        <div className="calendar-day__weekday">{weekday}</div>
        <div className="calendar-day__date">{dateStr}</div>
      </div>

      <div className="calendar-day__slots">
        {hours.map((hour, index) => {
          const hourMinutes = parseTimeToMinutes(hour);
          const workingStartMinutes = parseTimeToMinutes(workingStartTime);
          const workingEndMinutes = parseTimeToMinutes(workingEndTime);
          const isNonWorkingHour = hourMinutes < workingStartMinutes || hourMinutes >= workingEndMinutes;

          return (
            <div
              key={hour}
              className={`calendar-day__slot ${isNonWorkingHour ? 'calendar-day__slot--non-working' : ''}`}
              data-hour={hour}
              data-index={index}
            />
          );
        })}

        {/* Appointments layer */}
        {!isNonWorkday && (
          <div className="calendar-day__appointments">
            {dayAppointments.map(appointment => {
              const position = appointmentPositions.get(appointment._id);
              if (!position) return null;

              const style: React.CSSProperties = {
                top: `${position.top}%`,
                height: `${position.height}%`,
                left: `${position.left}%`,
                width: `${position.width}%`,
              };

              return (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  style={style}
                  onClick={onAppointmentClick}
                />
              );
            })}
          </div>
        )}

        {/* Non-workday overlay */}
        {isNonWorkday && (
          <div className="calendar-day__non-workday-overlay">
            <span>Not a workday</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Day;
