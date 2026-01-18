import { Schema, model } from "mongoose";
import { maxLength } from "zod";

const UserSchema = new Schema(
	{
		name: { type: String, required: true, },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true, select: false},
		role: { type: String, enum: ["user", "admin"], default: "user" },
	},
	{ timestamps: true }
);

export default model("User", UserSchema);
