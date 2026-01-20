import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { appointmentsApi } from "@/services/api/appointments";
import { useCalendarConfig } from "@/context";
import Week from "./Week";
import Icon from "@/components/Icon";
import { getMonday, addDays, formatMonthYear } from "@/utils/calendar";
import "./Calendar.scss";

export interface CalendarProps {
	userId: string;
}

const Calendar = ({ userId }: CalendarProps) => {
	const { isLoading: configLoading } = useCalendarConfig();
	const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
		getMonday(new Date()),
	);

	const {
		data: appointments = [],
		isLoading: loadingAppointments,
		error: appointmentsError,
	} = useQuery({
		queryKey: ["appointments", userId],
		queryFn: () => appointmentsApi.getAll({ userId }),
		enabled: !!userId,
	});

	const monthYear = formatMonthYear(currentWeekStart);
	const isLoading = configLoading || loadingAppointments;

	const shiftWeek = (days: number) =>
		setCurrentWeekStart((prev) => addDays(prev, days));
	const handleToday = () => setCurrentWeekStart(getMonday(new Date()));

	if (isLoading) {
		return (
			<div className="calendar calendar--loading">
				<div className="calendar__loading">
					<Icon
						name="Clock"
						size={48}
						className="calendar__loading-icon"
					/>
					<p>Loading calendar...</p>
				</div>
			</div>
		);
	}

	// Show error for appointments failure, but still display calendar
	const hasAppointmentsError = !!appointmentsError;

	return (
		<div className="calendar">
			<div className="calendar__header">
				<h2 className="calendar__title">{monthYear}</h2>

				<div className="calendar__controls">
					<button
						className="calendar__control-btn"
						onClick={() => shiftWeek(-7)}
						aria-label="Previous week"
						title="Previous week">
						<Icon name="ChevronLeft" size={20} />
					</button>

					<button
						className="calendar__today-btn"
						onClick={handleToday}
						aria-label="Go to current week">
						Today
					</button>

					<button
						className="calendar__control-btn"
						onClick={() => shiftWeek(7)}
						aria-label="Next week"
						title="Next week">
						<Icon name="ChevronRight" size={20} />
					</button>
				</div>
			</div>

			{hasAppointmentsError && (
				<div className="calendar__warning">
					<Icon name="AlertCircle" size={16} />
					<span>
						Unable to load appointments. Showing calendar only.
					</span>
				</div>
			)}

			<Week startDate={currentWeekStart} appointments={appointments} />
		</div>
	);
};

export default Calendar;
