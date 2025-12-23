import { Router } from "express";
import { validateBody } from "#middleware";
import { orderInputSchema, orderParamsSchema } from "#schemas";
import {
	getAllOrders,
	createOrder,
	getOrderById,
	updateOrder,
	deleteOrder,
} from "#controllers";

const orderRouter = Router();

orderRouter
	.route("/")
	.get(getAllOrders)
	.post(validateBody(orderInputSchema), createOrder);

orderRouter
	.route("/:id")
	.get(getOrderById)
	.put(
		validateBody(orderParamsSchema),
		validateBody(orderInputSchema),
		updateOrder
	)
	.delete(deleteOrder);

export default orderRouter;
