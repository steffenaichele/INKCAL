import { Router } from "express";
import { validateBody } from "#middleware";
import { categoryInputSchema, categoryParamsSchema } from "#schemas";
import { getAllCategories, createCategory, getCategoryById, updateCategory, deleteCategory } from "#controllers";

const categoryRouter = Router();

categoryRouter.route("/").get(getAllCategories).post(validateBody(categoryInputSchema), createCategory);

categoryRouter
  .route("/:id")
  .get(getCategoryById)
  .put(validateBody(categoryParamsSchema), validateBody(categoryInputSchema), updateCategory)
  .delete(deleteCategory);

export default categoryRouter;