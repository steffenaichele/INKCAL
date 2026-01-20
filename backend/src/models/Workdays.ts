import { Schema, model, Types } from "mongoose";

// Individual day configuration
const DayConfigSchema = new Schema(
	{
		dayOfWeek: {
			type: String,
			enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
			required: true,
		},
		isWorkday: { type: Boolean, default: true },
		startTime: {
			type: String,
			required: true,
			default: "00:00",
			validate: {
				validator: (v: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
				message: "Start time must be in HH:mm format (24-hour)",
			},
		},
		endTime: {
			type: String,
			required: true,
			default: "23:59",
			validate: {
				validator: (v: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
				message: "End time must be in HH:mm format (24-hour)",
			},
		},
	},
	{ _id: false }
);

// Virtual property to calculate work duration in minutes
DayConfigSchema.virtual("durationMinutes").get(function (this: any) {
	const startParts = this.startTime.split(":").map(Number);
	const endParts = this.endTime.split(":").map(Number);

	const [startHour = 0, startMin = 0] = startParts;
	const [endHour = 0, endMin = 0] = endParts;

	let startMinutes = startHour * 60 + startMin;
	let endMinutes = endHour * 60 + endMin;

	// Handle special case where end time is 23:59 (treat as full day)
	if (endHour === 23 && endMin === 59) {
		endMinutes = 24 * 60; // Full 24 hours
	}

	// If end is before start, assume it crosses midnight
	if (endMinutes < startMinutes) {
		endMinutes += 24 * 60;
	}

	return endMinutes - startMinutes;
});

// Virtual property to format duration as hours and minutes
DayConfigSchema.virtual("durationFormatted").get(function (this: any) {
	const minutes = this.durationMinutes;
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `${hours}h ${mins}m`;
});

const WorkdaysSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
			index: true,
		},
		timezone: {
			type: String,
			default: "Europe/Berlin",
		},
		workdays: {
			type: [DayConfigSchema],
			validate: {
				validator: (v: any[]) => {
					// Ensure all 7 days are present
					const days = new Set(v.map((d) => d.dayOfWeek));
					return (
						days.size === 7 &&
						[
							"monday",
							"tuesday",
							"wednesday",
							"thursday",
							"friday",
							"saturday",
							"sunday",
						].every((day) => days.has(day))
					);
				},
				message:
					"All 7 days of the week must be configured",
			},
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtual property to calculate total weekly work hours
WorkdaysSchema.virtual("totalWeeklyMinutes").get(function (this: any) {
	return this.workdays.reduce((total: number, day: any) => {
		if (!day.isWorkday) return total;
		return total + day.durationMinutes;
	}, 0);
});

// Virtual property to format total weekly hours
WorkdaysSchema.virtual("totalWeeklyHours").get(function (this: any) {
	const minutes = this.totalWeeklyMinutes;
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `${hours}h ${mins}m`;
});

// Virtual property to calculate average daily work hours
WorkdaysSchema.virtual("averageDailyMinutes").get(function (this: any) {
	const workdayCount = this.workdays.filter((day: any) => day.isWorkday).length;
	if (workdayCount === 0) return 0;
	return Math.round(this.totalWeeklyMinutes / workdayCount);
});

// Virtual property to format average daily hours
WorkdaysSchema.virtual("averageDailyHours").get(function (this: any) {
	const minutes = this.averageDailyMinutes;
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `${hours}h ${mins}m`;
});

export default model("Workdays", WorkdaysSchema);
