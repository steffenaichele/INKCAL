import { Router } from "express";
import { validateBody } from "#middleware";
import { productInputSchema, productParamsSchema } from "#schemas";
import {
	getAllProducts,
	createProduct,
	getProductById,
	updateProduct,
	deleteProduct,
} from "#controllers";

const productRouter = Router();

productRouter
	.route("/")
	.get(getAllProducts)
	.post(validateBody(productInputSchema), createProduct);

productRouter
	.route("/:id")
	.get(getProductById)
	.put(
		validateBody(productParamsSchema),
		validateBody(productInputSchema),
		updateProduct
	)
	.delete(deleteProduct);

export default productRouter;
