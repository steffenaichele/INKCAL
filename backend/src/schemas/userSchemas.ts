import { z } from "zod/v4";
import { isValidObjectId, Types } from "mongoose";

const minNameLength = 2;
const maxNameLength = 100;
const minPasswordLength = 6;
const maxPasswordLength = 256;

// Base Schemas (Internal/External)
const dbEntrySchema = z.strictObject({
	_id: z.instanceof(Types.ObjectId),
	createdAt: z.date(),
	updatedAt: z.date(),
	__v: z.int().nonnegative(),
});

export const userParamsSchema = z.strictObject({
	userId: z.string().refine((val) => isValidObjectId(val), "Invalid user ID"),
});

export const userInputSchema = z.strictObject({
	name: z
		.string()
		.min(
			minNameLength,
			`Name must be at least ${minNameLength} characters long`
		)
		.max(
			maxNameLength,
			`Name must be at most ${maxNameLength} characters long`
		),
	email: z.string().email("Invalid email address"),
	password: z
		.string()
		.min(
			minPasswordLength,
			`Password must be at least ${minPasswordLength} characters long`
		)
		.max(maxPasswordLength, `Password must be at most ${maxPasswordLength} characters long`),
	role: z.enum(["user", "admin"]).optional(),
});

// Output/DTO Schema
export const userSchema = z.object({
	...userInputSchema.shape,
	...dbEntrySchema.shape,
})

// Delivered Types (DTOs)
export type UserParamsDTO = z.infer<typeof userParamsSchema>;
export type UserInputDTO = z.infer<typeof userInputSchema>;
export type UserDTO = z.infer<typeof userSchema>;