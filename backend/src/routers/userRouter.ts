import { Router } from "express";
import { validateBody } from "#middleware";
import { userInputSchema, userParamsSchema } from "#schemas";
import { getAllAppointments, createAppointment, getAppointmentById, updateAppointment, deleteAppointment } from "#controllers";

const userRouter = Router();

userRouter
	.route("/")
	.get(getAllAppointments)
	.post(validateBody(userInputSchema), createAppointment);

userRouter
  .route("/:id")
  .get(getAppointmentById)
  .put(validateBody(userInputSchema), updateAppointment)
  .delete(deleteAppointment);

export default userRouter;