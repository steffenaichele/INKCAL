import { Schema, model } from "mongoose";

const OrderSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		products: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: { type: Number, required: true },
			},
		],
		total: { type: Number, required: true },
	},
	{ timestamps: true }
);

export default model("Order", OrderSchema);
