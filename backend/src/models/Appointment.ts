import { Schema, model } from "mongoose";

const AppointmentSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		date: { type: Date, required: true },
		title: { type: String, required: true },
		startTime: { type: String, required: true },
		endTime: { type: String, required: true },
	},
	{
		timestamps: true,
		discriminatorKey: "appointmentType",
		collection: "appointments",
	}
);

export default model("Appointment", AppointmentSchema);
