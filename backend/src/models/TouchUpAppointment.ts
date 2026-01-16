import { Schema } from "mongoose";
import Appointment from "./Appointment.ts";

const TouchUpSchema = new Schema({
    clientName: { type: String, required: true },
});

export default Appointment.discriminator("TouchUp", TouchUpSchema);

