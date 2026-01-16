import { Schema } from "mongoose";
import Appointment from "./Appointment.ts";

const ConsultationSchema = new Schema({
    clientName: { type: String, required: true },
});

export default Appointment.discriminator("Consultation", ConsultationSchema);

