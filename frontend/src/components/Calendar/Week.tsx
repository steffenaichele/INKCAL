import type { Appointment } from "@/types/api";
import { useCalendarConfig } from "@/context";
import Day from "./Day";
import {
	getWeekDates,
	getDayOfWeek,
	parseTimeToMinutes,
	addDays,
	formatDateForApi,
	generateBlockLabels,
} from "@/utils/calendar";
import "./Week.scss";

export interface WeekProps {
	startDate: Date; // Monday of the week
	appointments: Appointment[];
}

const Week = ({ startDate, appointments }: WeekProps) => {
	const { config } = useCalendarConfig();

	if (!config) {
		return (
			<div className="calendar-week calendar-week--loading">
				Loading...
			</div>
		);
	}

	const weekDates = getWeekDates(startDate);

	const weekStart = formatDateForApi(startDate);
	const weekEnd = formatDateForApi(addDays(startDate, 7));
	const weekAppointments = appointments.filter((app) => {
		const appDateOnly = app.date.split("T")[0];
		return appDateOnly >= weekStart && appDateOnly < weekEnd;
	});

	const blockLabels = generateBlockLabels(
		config.displayStartTime,
		config.displayEndTime,
		config.blockDuration,
	);

	const workdaysMap = new Map(config.workdays.map((w) => [w.dayOfWeek, w]));

	return (
		<div className="calendar-week">
			{/* Hour labels column */}
			<div className="calendar-week__hours">
				<div className="calendar-week__hours-header"></div>
				<div
					className="calendar-week__hours-list"
					style={{
						gridTemplateRows: `repeat(${config.totalBlocks}, 1fr)`,
					}}>
					{blockLabels.map(({ block, label }) => {
						const hourMinutes =
							parseTimeToMinutes(config.displayStartTime) +
							(block - 1) * config.blockDuration;
						const workingStartMinutes = parseTimeToMinutes(
							config.workingStartTime,
						);
						const workingEndMinutes = parseTimeToMinutes(
							config.workingEndTime,
						);
						const isNonWorkingHour =
							hourMinutes < workingStartMinutes ||
							hourMinutes >= workingEndMinutes;

						return (
							<div
								key={block}
								className={`calendar-week__hour-label ${isNonWorkingHour && label ? "calendar-week__hour-label--non-working" : ""}`}
								style={{ gridRow: block }}>
								{label || ""}
							</div>
						);
					})}
				</div>
			</div>

			{/* Days container */}
			<div className="calendar-week__days">
				{weekDates.map((date) => {
					const dayOfWeek = getDayOfWeek(date);
					const workdayConfig = workdaysMap.get(dayOfWeek) || null;
					const dayAppointments = weekAppointments.filter(
						(app) => app.date.split("T")[0] === formatDateForApi(date),
					);

					return (
						<Day
							key={date.toISOString()}
							date={date}
							workdayConfig={workdayConfig}
							appointments={dayAppointments}
							config={config}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default Week;
