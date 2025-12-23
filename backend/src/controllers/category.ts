import { Category } from "#models";
import type { CategoryDTO, CategoryInputDTO } from "#schemas";
import type { RequestHandler } from "express";

// GET /categories
const getAllCategories: RequestHandler<{}, CategoryDTO[]> = async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
};

// Post /categories
const createCategory: RequestHandler<{}, CategoryDTO, CategoryInputDTO> = async (req, res) => {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
};

// GET /categories/:id
const getCategoryById: RequestHandler<{ id: string }, CategoryDTO> = async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found", { cause: 404 });
    res.json(category);
};

// PUT /categories/:id
const updateCategory: RequestHandler<{ id: string }, CategoryDTO, CategoryInputDTO > = async (req, res) => {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCategory) throw new Error("Category not found", { cause: 404 });
    res.json(updatedCategory);
};

// DELETE /categories/:id
const deleteCategory: RequestHandler<{ id: string }, { message: string }, CategoryInputDTO> = async (req, res) => {
    const { id } = req.params;
    const foundCategory = await Category.findByIdAndDelete(id);
    if (!foundCategory) throw new Error("Category not found", { cause: 404 });
    res.json({ message: "Category deleted" });
}

export {
    getAllCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
};