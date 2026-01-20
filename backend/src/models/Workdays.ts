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
			validate: {
				validator: (v: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
				message: "Start time must be in HH:mm format (24-hour)",
			},
		},
		endTime: {
			type: String,
			required: true,
			validate: {
				validator: (v: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
				message: "End time must be in HH:mm format (24-hour)",
			},
		},
	},
	{ _id: false }
);

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
	{ timestamps: true }
);

export default model("Workdays", WorkdaysSchema);
