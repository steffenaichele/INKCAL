import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { appointmentsApi } from "@/services/api/appointments";
import { useCalendarConfig } from "@/context";
import type { Appointment } from "@/types/api";
import Week from "./Week";
import Icon from "@/components/common/Icon";
import { Button } from "@/components/ui/Button/Button";
import { getMonday, addDays, formatMonthYear } from "@/utils/calendar";
import "./Calendar.scss";

export interface CalendarProps {
	userId: string;
	onEditAppointment?: (appointment: Appointment) => void;
	onDeleteAppointment?: (appointment: Appointment) => void;
}

const Calendar = ({ userId, onEditAppointment, onDeleteAppointment }: CalendarProps) => {
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
					<Button
						className="calendar__control-btn"
						onClick={() => shiftWeek(-7)}
						variant="ghost"
						size="sm"
						aria-label="Previous week"
						title="Previous week">
						<Icon name="ChevronLeft" size={20} />
					</Button>

					<Button
						className="calendar__today-btn"
						onClick={handleToday}
						variant="ghost"
						size="sm"
						aria-label="Go to current week">
						Today
					</Button>

					<Button
						className="calendar__control-btn"
						onClick={() => shiftWeek(7)}
						variant="ghost"
						size="sm"
						aria-label="Next week"
						title="Next week">
						<Icon name="ChevronRight" size={20} />
					</Button>
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

			<Week
			startDate={currentWeekStart}
			appointments={appointments}
			onEditAppointment={onEditAppointment}
			onDeleteAppointment={onDeleteAppointment}
		/>
		</div>
	);
};

export default Calendar;
