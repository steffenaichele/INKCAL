import type { Appointment, DayConfig } from "@/types/api";
import type { CalendarConfig } from "@/context";
import AppointmentCard from "./AppointmentCard";
import {
	formatWeekdayShort,
	formatDateShort,
	sortAppointmentsByTime,
	groupOverlappingAppointments,
	isToday,
	calculateBlockPosition,
	calculateBlockSpan,
} from "@/utils/calendar";
import "./Day.scss";

export interface DayProps {
	date: Date;
	workdayConfig: DayConfig | null;
	appointments: Appointment[]; // Pre-filtered by Week
	config: CalendarConfig;
}

const Day = ({ date, workdayConfig, appointments, config }: DayProps) => {
	const weekday = formatWeekdayShort(date);
	const dateStr = formatDateShort(date);
	const today = isToday(date);

	const sortedAppointments = sortAppointmentsByTime(appointments);
	const appointmentGroups = groupOverlappingAppointments(sortedAppointments);

	const appointmentGridPositions = (() => {
		const positions = new Map<
			string,
			{ gridRow: string; gridColumn: string }
		>();

		appointmentGroups.forEach((group) => {
			const groupSize = group.length;

			group.forEach((appointment, index) => {
				const rowStart = calculateBlockPosition(
					appointment.startTime,
					config.displayStartTime,
					config.blockDuration,
				);
				const rowSpan = calculateBlockSpan(
					appointment.startTime,
					appointment.endTime,
					config.blockDuration,
				);

				const columnStart = index + 1;
				const gridRow = `${rowStart} / span ${rowSpan}`;
				const gridColumn =
					groupSize > 1 ? `${columnStart} / span 1` : "1 / -1";

				positions.set(appointment._id, { gridRow, gridColumn });
			});
		});

		return positions;
	})();

	const nonWorkingRanges = (() => {
		if (!workdayConfig || !workdayConfig.isWorkday) {
			return [{ startBlock: 1, endBlock: config.totalBlocks }];
		}

		const ranges: Array<{ startBlock: number; endBlock: number }> = [];
		const workingStartBlock = calculateBlockPosition(
			config.workingStartTime,
			config.displayStartTime,
			config.blockDuration,
		);
		const workingEndBlock = calculateBlockPosition(
			config.workingEndTime,
			config.displayStartTime,
			config.blockDuration,
		);

		if (workingStartBlock > 1) {
			ranges.push({ startBlock: 1, endBlock: workingStartBlock - 1 });
		}

		if (workingEndBlock <= config.totalBlocks) {
			ranges.push({
				startBlock: workingEndBlock,
				endBlock: config.totalBlocks,
			});
		}

		return ranges;
	})();

	const isNonWorkday = !workdayConfig || !workdayConfig.isWorkday;

	return (
		<div
			className={`calendar-day ${today ? "calendar-day--today" : ""} ${isNonWorkday ? "calendar-day--non-workday" : ""}`}>
			<div className="calendar-day__header">
				<div className="calendar-day__weekday">{weekday}</div>
				<div className="calendar-day__date">{dateStr}</div>
			</div>

			<div
				className="calendar-day__slots"
				style={{
					gridTemplateRows: `repeat(${config.totalBlocks}, 1fr)`,
				}}>
				{/* Non-working time cards */}
				{nonWorkingRanges.map((range, index) => (
					<div
						key={`non-working-${index}`}
						className="calendar-day__non-working-card"
						style={{
							gridRow: `${range.startBlock} / ${range.endBlock + 1}`,
							gridColumn: "1 / -1",
						}}>
						{isNonWorkday && (
							<div className="calendar-day__non-working-label">
								<span>Not a workday</span>
							</div>
						)}
					</div>
				))}

				{/* Appointments */}
				{!isNonWorkday &&
					sortedAppointments.map((appointment) => {
						const position = appointmentGridPositions.get(
							appointment._id,
						);
						if (!position) return null;

						return (
							<AppointmentCard
								key={appointment._id}
								appointment={appointment}
								style={{
									gridRow: position.gridRow,
									gridColumn: position.gridColumn,
								}}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default Day;
