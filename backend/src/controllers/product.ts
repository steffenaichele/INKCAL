import { Product } from "#models";
import type { ProductDTO, ProductInputDTO } from "#schemas";
import type { RequestHandler } from "express";

// GET /products
const getAllProducts: RequestHandler<{}, ProductDTO[]> = async (req, res) => {
	const products = await Product.find().lean();
	res.json(products);
};

// Post /products
const createProduct: RequestHandler<{}, ProductDTO, ProductInputDTO> = async (
	req,
	res
) => {
	const newProduct = await Product.create(req.body);
	res.status(201).json(newProduct);
};

// GET /products/:id
const getProductById: RequestHandler<{ id: string }, ProductDTO> = async (
	req,
	res
) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	if (!product) throw new Error("Product not found", { cause: 404 });
	res.json(product);
};

// PUT /products/:id
const updateProduct: RequestHandler<
	{ id: string },
	ProductDTO,
	ProductInputDTO
> = async (req, res) => {
	const { id } = req.params;
	const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
		new: true,
	});
	if (!updatedProduct) throw new Error("Product not found", { cause: 404 });
	res.json(updatedProduct);
};

// DELETE /products/:id
const deleteProduct: RequestHandler<
	{ id: string },
	{ message: string },
	ProductInputDTO
> = async (req, res) => {
	const { id } = req.params;
	const foundProduct = await Product.findByIdAndDelete(id);
	if (!foundProduct) throw new Error("Product not found", { cause: 404 });
	res.json({ message: "Product deleted" });
};

export {
	getAllProducts,
	createProduct,
	getProductById,
	updateProduct,
	deleteProduct,
};
