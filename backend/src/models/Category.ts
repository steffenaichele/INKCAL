import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
	{
		name: { type: String, required: true, minLength: 2 },
	},
	{ timestamps: true }
);

export default model("Category", CategorySchema);
