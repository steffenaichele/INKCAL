import { Router } from "express";
import { validateBody } from "#middleware";
import { appointmentInputWithTypeSchema } from "#schemas";
import {
	getAllAppointments,
	createAppointment,
	getAppointmentById,
	updateAppointment,
	deleteAppointment,
} from "#controllers";

const appointmentRouter = Router();

appointmentRouter
	.route("/")
	.get(getAllAppointments)
	.post(validateBody(appointmentInputWithTypeSchema), createAppointment);

appointmentRouter
	.route("/:id")
	.get(getAppointmentById)
	.put(updateAppointment)
	.delete(deleteAppointment);

export default appointmentRouter;