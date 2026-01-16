import { Schema, model } from "mongoose";

const AppointmentSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		date: { type: Date, required: true },
		title: { type: String, required: true },
		description: { type: String },
		startTime: { type: String, required: true },
		endTime: { type: String, required: true },
		categoryId: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
	},
	{ timestamps: true }
);

export default model("Appointment", AppointmentSchema);
