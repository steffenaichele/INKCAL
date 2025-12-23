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

export const categoryParamsSchema = z.strictObject({
    categoryId: z.string().refine((val) => isValidObjectId(val), "Invalid category ID"),
});

export const categoryInputSchema = z.strictObject({
    name: z
            .string()
            .min(
                minNameLength,
                `Name must be at least ${minNameLength} characters long`
            ),
});

// Output/DTO Schema
export const categorySchema = z.object({
    ...categoryInputSchema.shape,
    ...dbEntrySchema.shape,
})

// Delivered Types (DTOs)
export type CategoryParamsDTO = z.infer<typeof categoryParamsSchema>;
export type CategoryInputDTO = z.infer<typeof categoryInputSchema>;
export type CategoryDTO = z.infer<typeof categorySchema>;