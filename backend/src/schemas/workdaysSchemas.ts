import { z } from "zod/v4";
import { isValidObjectId, Types } from "mongoose";

// Time format validation (HH:mm in 24-hour format)
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Day of week enum
const dayOfWeekEnum = z.enum([
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday",
]);

// Base Schemas (Internal/External)
const dbEntrySchema = z.strictObject({
	_id: z.instanceof(Types.ObjectId),
	createdAt: z.date(),
	updatedAt: z.date(),
	__v: z.int().nonnegative(),
});

// Individual day configuration schema
export const dayConfigSchema = z.strictObject({
	dayOfWeek: dayOfWeekEnum,
	isWorkday: z.boolean().default(true),
	startTime: z
		.string()
		.regex(timeRegex, "Start time must be in HH:mm format (24-hour)"),
	endTime: z
		.string()
		.regex(timeRegex, "End time must be in HH:mm format (24-hour)"),
}).refine(
	(data) => {
		// Validate that end time is after start time
		const startParts = data.startTime.split(":").map(Number);
		const endParts = data.endTime.split(":").map(Number);

		if (startParts.length !== 2 || endParts.length !== 2) return false;

		const [startHour = 0, startMin = 0] = startParts;
		const [endHour = 0, endMin = 0] = endParts;
		const startMinutes = startHour * 60 + startMin;
		const endMinutes = endHour * 60 + endMin;
		return endMinutes > startMinutes;
	},
	{
		message: "End time must be after start time",
	}
);

// Workdays input schema (for creating/updating)
export const workdaysInputSchema = z.strictObject({
	timezone: z.string().default("Europe/Berlin"),
	workdays: z
		.array(dayConfigSchema)
		.length(7, "All 7 days of the week must be configured")
		.refine(
			(days) => {
				// Ensure all 7 unique days are present
				const daySet = new Set(days.map((d) => d.dayOfWeek));
				const requiredDays: Array<"monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"> = [
					"monday",
					"tuesday",
					"wednesday",
					"thursday",
					"friday",
					"saturday",
					"sunday",
				];
				return (
					daySet.size === 7 &&
					requiredDays.every((day) => daySet.has(day))
				);
			},
			{
				message: "Each day of the week must be configured exactly once",
			}
		),
});

// Output/DTO Schema
export const workdaysSchema = z.object({
	userId: z.instanceof(Types.ObjectId),
	...workdaysInputSchema.shape,
	...dbEntrySchema.shape,
});

// Params schema for user ID
export const workdaysParamsSchema = z.strictObject({
	userId: z.string().refine((val) => isValidObjectId(val), "Invalid user ID"),
});

// Delivered Types (DTOs)
export type DayConfigDTO = z.infer<typeof dayConfigSchema>;
export type WorkdaysInputDTO = z.infer<typeof workdaysInputSchema>;
export type WorkdaysDTO = z.infer<typeof workdaysSchema>;
export type WorkdaysParamsDTO = z.infer<typeof workdaysParamsSchema>;
