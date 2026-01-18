import "#db";
import { User } from "#models";
import { Appointment } from "#models";
import mongoose from "mongoose";

const cleanDatabase = async () => {
	try {
		console.log("🧹 Starting database cleanup...");

		// Delete all users
		const deletedUsers = await User.deleteMany({});
		console.log(`✅ Deleted ${deletedUsers.deletedCount} users`);

		// Delete all appointments
		const deletedAppointments = await Appointment.deleteMany({});
		console.log(`✅ Deleted ${deletedAppointments.deletedCount} appointments`);

		console.log("🎉 Database cleanup completed!");

		// Close connection
		await mongoose.connection.close();
		console.log("👋 Database connection closed");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error during cleanup:", error);
		process.exit(1);
	}
};

cleanDatabase();
