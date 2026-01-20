import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

// User Schema
const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true, select: false },
		role: { type: String, enum: ["user", "admin"], default: "user" },
	},
	{ timestamps: true }
);

const User = mongoose.model("User", UserSchema);

/**
 * List all users in the database
 */
async function listUsers() {
	try {
		await mongoose.connect(MONGODB_URI, { dbName: "appdb" });
		console.log("Connected to database\n");

		const users = await User.find({}).select("name email role createdAt");

		if (users.length === 0) {
			console.log("No users found in database");
		} else {
			console.log(`Found ${users.length} user(s):\n`);
			users.forEach((user, index) => {
				console.log(`${index + 1}. ${user.name}`);
				console.log(`   Email: ${user.email}`);
				console.log(`   Role: ${user.role}`);
				console.log(`   Created: ${user.createdAt.toLocaleString()}`);
				console.log();
			});
		}

		await mongoose.disconnect();
		console.log("Database connection closed");
	} catch (error) {
		console.error("Error listing users:", error);
		await mongoose.disconnect();
		process.exit(1);
	}
}

listUsers();
