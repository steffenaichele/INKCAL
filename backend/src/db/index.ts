import mongoose from 'mongoose';

// Auto-connect for app startup
try {
	await mongoose.connect(process.env.MONGODB_URI!, {
		dbName: "appdb",
	});
	console.log("✅ MongoDB verbunden");
} catch (error) {
	console.error("❌ Fehler beim Verbinden mit MongoDB:", error);
	process.exit(1);
}

// Export functions for scripts
export async function connect() {
	if (mongoose.connection.readyState === 0) {
		await mongoose.connect(process.env.MONGODB_URI!, {
			dbName: "appdb",
		});
	}
}

export async function disconnect() {
	await mongoose.disconnect();
}
