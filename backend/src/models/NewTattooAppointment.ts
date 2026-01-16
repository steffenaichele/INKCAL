import { Schema } from "mongoose";
import Appointment from "./Appointment.ts";

const NewTattooSchema = new Schema({
    clientName: { type: String, required: true },
    designDescription: { type: String, required: true },
    placement: { type: String},
    size: { type: String},
    color: { type: Boolean },
});

export default Appointment.discriminator("NewTattoo", NewTattooSchema);

