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

const NewTattooSchema = new Schema({
	clientName: { type: String, required: true },
	designDescription: { type: String, required: true },
	placement: { type: String, required: false },
	size: { type: String, required: false },
	color: { type: Boolean, required: false },
    contact: { type: ContactSchema, required: true },
});

export default Appointment.discriminator("NewTattoo", NewTattooSchema);
