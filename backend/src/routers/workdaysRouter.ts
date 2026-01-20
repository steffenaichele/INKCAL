import { Router } from "express";
import { validateBody, authenticate, authorize } from "#middleware";
import { workdaysInputSchema } from "#schemas";
import {
	getWorkdaysByUserId,
	createWorkdays,
	updateWorkdays,
	deleteWorkdays,
	getAllWorkdays,
} from "#controllers";

const workdaysRouter = Router();

// GET all workdays (admin only)
workdaysRouter
	.route("/")
	.get(authenticate, authorize(["admin"]), getAllWorkdays);

// Routes for specific user's workdays
workdaysRouter
	.route("/:userId")
	.get(authenticate, authorize(["admin", "self"]), getWorkdaysByUserId)
	.post(
		authenticate,
		authorize(["admin", "self"]),
		validateBody(workdaysInputSchema),
		createWorkdays
	)
	.put(
		authenticate,
		authorize(["admin", "self"]),
		validateBody(workdaysInputSchema),
		updateWorkdays
	)
	.delete(authenticate, authorize(["admin", "self"]), deleteWorkdays);

export default workdaysRouter;
