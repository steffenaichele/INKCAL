import { Router } from "express";
import { validateBody } from "#middleware";
import { userInputSchema, userParamsSchema } from "#schemas";
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from "#controllers";

const userRouter = Router();

userRouter.route("/").get(getAllUsers).post(validateBody(userInputSchema), createUser);

userRouter
  .route("/:id")
  .get(getUserById)
  .put(validateBody(userInputSchema), updateUser)
  .delete(deleteUser);

export default userRouter;