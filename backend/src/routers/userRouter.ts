import { Router } from "express";
import { validateBody, authenticate, authorize } from "#middleware";
import { userInputSchema } from "#schemas";
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from "#controllers";

const userRouter = Router();

userRouter
	.route("/")
	.get(getAllUsers)
	.post(validateBody(userInputSchema), createUser);

userRouter
	.route("/:id")
	.get(getUserById)
	.put(authenticate, authorize(['admin', 'self']), validateBody(userInputSchema), updateUser)
	.delete(deleteUser);

export default userRouter;