import { Schema } from "mongoose";
import Appointment from "./Appointment.ts";

const ContactSchema = new Schema(
	{
		type: {
			type: String,
			required: true,
			enum: ["Instagram", "WhatsApp", "Email"],
		},
		details: { type: String, required: true },
	},
	{ _id: false }
);

const ConsultationSchema = new Schema({
	clientName: { type: String, required: true },
	contact: { type: ContactSchema, required: true },
});

export default Appointment.discriminator("Consultation", ConsultationSchema);

