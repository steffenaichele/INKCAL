import mongoose from 'mongoose';

try {
	await mongoose.connect(process.env.MONGODB_URI!, {
		dbName: "appdb",
	});
	console.log("✅ MongoDB verbunden");
} catch (error) {
	console.error("❌ Fehler beim Verbinden mit MongoDB:", error);
	process.exit(1);
}
