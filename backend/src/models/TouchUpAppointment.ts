import { Schema } from "mongoose";
import Appointment from "./Appointment.ts";

const ContactSchema = new Schema(
    {
        contactType: {
            type: String,
            required: true,
            enum: ["Instagram", "WhatsApp", "EMail"],
        },
        contactValue: { type: String, required: true },
    },
    { _id: false }
);

const TouchUpSchema = new Schema({
	clientName: { type: String, required: true },
	contact: { type: ContactSchema, required: true },
});

export default Appointment.discriminator("TouchUp", TouchUpSchema);

