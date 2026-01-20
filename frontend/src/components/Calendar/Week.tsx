import { useMemo } from 'react';
import type { Appointment, DayConfig } from '@/types/api';
import Day from './Day';
import { getWeekDates, getDayOfWeek, parseTimeToMinutes, getHoursBetween, addHoursToTime } from '@/utils/calendar';
import './Week.scss';

export interface WeekProps {
  startDate: Date; // Monday of the week
  workdays: DayConfig[];
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
}

const Week = ({ startDate, workdays, appointments, onAppointmentClick }: WeekProps) => {
  // Generate 7 dates for the week (Monday through Sunday)
  const weekDates = useMemo(() => {
    return getWeekDates(startDate);
  }, [startDate]);

  // Map workdays array to a lookup object by dayOfWeek
  const workdaysMap = useMemo(() => {
    const map = new Map<string, DayConfig>();
    workdays.forEach(day => {
      map.set(day.dayOfWeek, day);
    });
    return map;
  }, [workdays]);

  // Calculate unified time range for the entire week (earliest start to latest end)
  const weekTimeRange = useMemo(() => {
    let earliestStart = '23:59';
    let latestEnd = '00:00';

    workdays.forEach(day => {
      if (day.isWorkday) {
        const startMinutes = parseTimeToMinutes(day.startTime);
        const endMinutes = parseTimeToMinutes(day.endTime);
        const currentEarliestMinutes = parseTimeToMinutes(earliestStart);
        const currentLatestMinutes = parseTimeToMinutes(latestEnd);

        if (startMinutes < currentEarliestMinutes) {
          earliestStart = day.startTime;
        }
        if (endMinutes > currentLatestMinutes) {
          latestEnd = day.endTime;
        }
      }
    });

    // If no workdays found, default to 9 AM - 5 PM
    if (earliestStart === '23:59' && latestEnd === '00:00') {
      earliestStart = '09:00';
      latestEnd = '17:00';
    }

    // Add buffer hours (1 hour before and after working hours)
    const workingStartTime = earliestStart;
    const workingEndTime = latestEnd;
    const displayStartTime = addHoursToTime(earliestStart, -1);
    const displayEndTime = addHoursToTime(latestEnd, 1);

    return {
      startTime: displayStartTime,
      endTime: displayEndTime,
      workingStartTime,
      workingEndTime,
      hours: getHoursBetween(displayStartTime, displayEndTime),
    };
  }, [workdays]);

  return (
    <div className="calendar-week">
      <div className="calendar-week__container">
        {/* Hour labels column */}
        <div className="calendar-week__hours">
          <div className="calendar-week__hours-header"></div>
          <div className="calendar-week__hours-list">
            {weekTimeRange.hours.map(hour => {
              const hourMinutes = parseTimeToMinutes(hour);
              const workingStartMinutes = parseTimeToMinutes(weekTimeRange.workingStartTime);
              const workingEndMinutes = parseTimeToMinutes(weekTimeRange.workingEndTime);
              const isNonWorkingHour = hourMinutes < workingStartMinutes || hourMinutes >= workingEndMinutes;

              return (
                <div
                  key={hour}
                  className={`calendar-week__hour-label ${isNonWorkingHour ? 'calendar-week__hour-label--non-working' : ''}`}
                >
                  {hour}
                </div>
              );
            })}
          </div>
        </div>

        {/* Days grid */}
        <div className="calendar-week__days">
          {weekDates.map(date => {
            const dayOfWeek = getDayOfWeek(date);
            const workdayConfig = workdaysMap.get(dayOfWeek) || null;

            return (
              <Day
                key={date.toISOString()}
                date={date}
                workdayConfig={workdayConfig}
                appointments={appointments}
                onAppointmentClick={onAppointmentClick}
                weekStartTime={weekTimeRange.startTime}
                weekEndTime={weekTimeRange.endTime}
                weekHours={weekTimeRange.hours}
                workingStartTime={weekTimeRange.workingStartTime}
                workingEndTime={weekTimeRange.workingEndTime}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Week;
