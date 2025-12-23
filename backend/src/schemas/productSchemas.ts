import { z } from "zod/v4";
import { isValidObjectId, Types } from "mongoose";

const minNameLength = 2;

// Base Schemas (Internal/External)
const dbEntrySchema = z.strictObject({
    _id: z.instanceof(Types.ObjectId),
    createdAt: z.date(),
    updatedAt: z.date(),
    __v: z.int().nonnegative(),
});

export const productParamsSchema = z.strictObject({
    productId: z.string().refine((val) => isValidObjectId(val), "Invalid product ID"),
});

export const productInputSchema = z.strictObject({
    name: z.string().min(minNameLength, `Name must be at least ${minNameLength} characters long`),
    description: z.string(),
    price: z.number().nonnegative("Price must be a non-negative number"),
    categoryId: z.instanceof(Types.ObjectId),
});

// Output/DTO Schema
export const productSchema = z.object({
    ...productInputSchema.shape,
    ...dbEntrySchema.shape,
})

// Delivered Types (DTOs)
export type ProductParamsDTO = z.infer<typeof productParamsSchema>;
export type ProductInputDTO = z.infer<typeof productInputSchema>;
export type ProductDTO = z.infer<typeof productSchema>;