import { Schema } from "mongoose";
import Appointment from "./Appointment.ts";

const BlockerSchema = new Schema({
    clientName: { type: String, required: true },
});

export default Appointment.discriminator("Blocker", BlockerSchema);

