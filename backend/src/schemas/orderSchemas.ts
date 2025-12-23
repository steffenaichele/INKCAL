import { z } from "zod/v4";
import { isValidObjectId, Types } from "mongoose";

// Base Schemas (Internal/External)
const dbEntrySchema = z.strictObject({
    _id: z.instanceof(Types.ObjectId),
    createdAt: z.date(),
    updatedAt: z.date(),
    __v: z.int().nonnegative(),
});

export const orderParamsSchema = z.strictObject({
    userId: z.string().refine((val) => isValidObjectId(val), "Invalid user ID"),
});

export const orderInputSchema = z.strictObject({
    products: z.array(z.strictObject({
        productId: z.instanceof(Types.ObjectId),
        quantity: z.number().min(1, "Quantity must be at least 1"),
    })),
    total: z.number().nonnegative("Total must be a non-negative number"),
});

// Output/DTO Schema
export const orderSchema = z.object({
    ...orderInputSchema.shape,
    ...dbEntrySchema.shape,
})

// Delivered Types (DTOs)
export type OrderParamsDTO = z.infer<typeof orderParamsSchema>;
export type OrderInputDTO = z.infer<typeof orderInputSchema>;
export type OrderDTO = z.infer<typeof orderSchema>;