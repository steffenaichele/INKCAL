import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

// Define all schemas inline to avoid import issues
const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true, select: false },
		role: { type: String, enum: ["user", "admin"], default: "user" },
	},
	{ timestamps: true }
);

const AppointmentSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		date: { type: Date, required: true },
		title: { type: String, required: true },
		startTime: { type: String, required: true },
		endTime: { type: String, required: true },
	},
	{
		timestamps: true,
		discriminatorKey: "appointmentType",
		collection: "appointments",
	}
);

const DayConfigSchema = new mongoose.Schema(
	{
		dayOfWeek: {
			type: String,
			enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
			required: true,
		},
		isWorkday: { type: Boolean, default: true },
		startTime: { type: String, required: true, default: "00:00" },
		endTime: { type: String, required: true, default: "23:59" },
	},
	{ _id: false }
);

const WorkdaysSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		timezone: { type: String, default: "Europe/Berlin" },
		workdays: { type: [DayConfigSchema] },
	},
	{ timestamps: true }
);

// Models
const User = mongoose.model("User", UserSchema);
const Appointment = mongoose.model("Appointment", AppointmentSchema);
const Workdays = mongoose.model("Workdays", WorkdaysSchema);

// Discriminators for appointment types
const NewTattooAppointment = Appointment.discriminator(
	"NewTattoo",
	new mongoose.Schema({
		clientName: { type: String, required: true },
		clientEmail: { type: String },
		clientPhone: { type: String },
		depositPaid: { type: Boolean, default: false },
		estimatedDuration: { type: Number },
		bodyPart: { type: String },
		style: { type: String },
		description: { type: String },
	})
);

const TouchUpAppointment = Appointment.discriminator(
	"TouchUp",
	new mongoose.Schema({
		clientName: { type: String, required: true },
		clientEmail: { type: String },
		clientPhone: { type: String },
		depositPaid: { type: Boolean, default: false },
		estimatedDuration: { type: Number },
		originalDate: { type: Date },
		reason: { type: String },
	})
);

const ConsultationAppointment = Appointment.discriminator(
	"Consultation",
	new mongoose.Schema({
		clientName: { type: String, required: true },
		clientEmail: { type: String },
		clientPhone: { type: String },
		depositPaid: { type: Boolean, default: false },
		estimatedDuration: { type: Number },
		consultationType: { type: String },
		notes: { type: String },
	})
);

const BlockerAppointment = Appointment.discriminator(
	"Blocker",
	new mongoose.Schema({
		reason: { type: String },
	})
);

/**
 * Seed example appointments and workdays for a user
 * Usage: npm run seed-example -- <email>
 */
async function seedExampleData(userEmail: string) {
	try {
		await mongoose.connect(MONGODB_URI, { dbName: "appdb" });
		console.log("Connected to database");

		// Find user by email
		const user = await User.findOne({ email: userEmail });
		if (!user) {
			throw new Error(`User with email ${userEmail} not found`);
		}

		console.log(`Found user: ${user.name} (${user.email})`);

		// Delete existing appointments and workdays for this user
		await Appointment.deleteMany({ userId: user._id });
		await Workdays.deleteMany({ userId: user._id });
		console.log("Cleaned up existing data");

		// Create workdays configuration (Monday-Friday 9 AM - 6 PM, Saturday 10 AM - 2 PM)
		const workdays = await Workdays.create({
			userId: user._id,
			timezone: "Europe/Berlin",
			workdays: [
				{ dayOfWeek: "monday", isWorkday: true, startTime: "09:00", endTime: "18:00" },
				{ dayOfWeek: "tuesday", isWorkday: true, startTime: "09:00", endTime: "18:00" },
				{ dayOfWeek: "wednesday", isWorkday: true, startTime: "09:00", endTime: "18:00" },
				{ dayOfWeek: "thursday", isWorkday: true, startTime: "09:00", endTime: "18:00" },
				{ dayOfWeek: "friday", isWorkday: true, startTime: "09:00", endTime: "18:00" },
				{ dayOfWeek: "saturday", isWorkday: true, startTime: "10:00", endTime: "14:00" },
				{ dayOfWeek: "sunday", isWorkday: false, startTime: "00:00", endTime: "23:59" },
			],
		});

		console.log("Created workdays configuration");

		// Helper function to get date for this week
		const getDateThisWeek = (dayOffset: number) => {
			const today = new Date();
			const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
			const monday = new Date(today);
			monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)); // Get Monday of this week
			monday.setHours(0, 0, 0, 0);

			const targetDate = new Date(monday);
			targetDate.setDate(monday.getDate() + dayOffset);
			return targetDate;
		};

		// Create example appointments for this week
		const appointments = [];

		// Monday: New Tattoo (full day session)
		appointments.push(
			await NewTattooAppointment.create({
				userId: user._id,
				date: getDateThisWeek(0), // Monday
				title: "Full Sleeve Session",
				startTime: "10:00",
				endTime: "16:00",
				clientName: "John Smith",
				clientEmail: "john.smith@example.com",
				clientPhone: "+49 123 456789",
				depositPaid: true,
				estimatedDuration: 360, // 6 hours
				bodyPart: "Left Arm",
				style: "Japanese",
				description: "Traditional Japanese dragon sleeve, session 2 of 4",
			})
		);

		// Tuesday: Consultation + Touch Up
		appointments.push(
			await ConsultationAppointment.create({
				userId: user._id,
				date: getDateThisWeek(1), // Tuesday
				title: "Consultation: Back Piece",
				startTime: "09:30",
				endTime: "10:30",
				clientName: "Sarah Johnson",
				clientEmail: "sarah.j@example.com",
				clientPhone: "+49 987 654321",
				depositPaid: false,
				estimatedDuration: 60,
				consultationType: "Design Review",
				notes: "Discuss color palette and placement for large back piece",
			})
		);

		appointments.push(
			await TouchUpAppointment.create({
				userId: user._id,
				date: getDateThisWeek(1), // Tuesday
				title: "Touch-up Session",
				startTime: "14:00",
				endTime: "15:30",
				clientName: "Mike Davis",
				clientEmail: "mike.d@example.com",
				clientPhone: "+49 555 123456",
				depositPaid: true,
				estimatedDuration: 90,
				originalDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
				reason: "Color fade on shoulder piece",
			})
		);

		// Wednesday: Multiple appointments
		appointments.push(
			await NewTattooAppointment.create({
				userId: user._id,
				date: getDateThisWeek(2), // Wednesday
				title: "Minimalist Tattoo",
				startTime: "11:00",
				endTime: "12:30",
				clientName: "Emma Wilson",
				clientEmail: "emma.w@example.com",
				clientPhone: "+49 321 654987",
				depositPaid: true,
				estimatedDuration: 90,
				bodyPart: "Wrist",
				style: "Minimalist",
				description: "Small geometric mountain design",
			})
		);

		appointments.push(
			await BlockerAppointment.create({
				userId: user._id,
				date: getDateThisWeek(2), // Wednesday
				title: "Lunch Break",
				startTime: "13:00",
				endTime: "14:00",
				reason: "Personal time",
			})
		);

		appointments.push(
			await NewTattooAppointment.create({
				userId: user._id,
				date: getDateThisWeek(2), // Wednesday
				title: "Flower Tattoo",
				startTime: "15:00",
				endTime: "17:00",
				clientName: "Lisa Brown",
				clientEmail: "lisa.b@example.com",
				clientPhone: "+49 444 555666",
				depositPaid: true,
				estimatedDuration: 120,
				bodyPart: "Ankle",
				style: "Watercolor",
				description: "Watercolor rose with soft colors",
			})
		);

		// Thursday: Busy day
		appointments.push(
			await ConsultationAppointment.create({
				userId: user._id,
				date: getDateThisWeek(3), // Thursday
				title: "New Client Consultation",
				startTime: "09:00",
				endTime: "10:00",
				clientName: "Alex Turner",
				clientEmail: "alex.t@example.com",
				clientPhone: "+49 777 888999",
				depositPaid: false,
				estimatedDuration: 60,
				consultationType: "First Meeting",
				notes: "Interested in portrait tattoo of grandmother",
			})
		);

		appointments.push(
			await NewTattooAppointment.create({
				userId: user._id,
				date: getDateThisWeek(3), // Thursday
				title: "Cover-up Tattoo",
				startTime: "11:00",
				endTime: "14:00",
				clientName: "Tom Anderson",
				clientEmail: "tom.a@example.com",
				clientPhone: "+49 111 222333",
				depositPaid: true,
				estimatedDuration: 180,
				bodyPart: "Forearm",
				style: "Neo-Traditional",
				description: "Cover-up of old tribal tattoo with neo-trad eagle",
			})
		);

		appointments.push(
			await NewTattooAppointment.create({
				userId: user._id,
				date: getDateThisWeek(3), // Thursday
				title: "Script Tattoo",
				startTime: "15:00",
				endTime: "16:00",
				clientName: "Rachel Green",
				clientEmail: "rachel.g@example.com",
				clientPhone: "+49 999 888777",
				depositPaid: true,
				estimatedDuration: 60,
				bodyPart: "Ribcage",
				style: "Script",
				description: "Quote in elegant cursive font",
			})
		);

		// Friday: Touch-ups
		appointments.push(
			await TouchUpAppointment.create({
				userId: user._id,
				date: getDateThisWeek(4), // Friday
				title: "Free Touch-up",
				startTime: "10:00",
				endTime: "11:00",
				clientName: "Chris Martin",
				clientEmail: "chris.m@example.com",
				clientPhone: "+49 666 777888",
				depositPaid: false,
				estimatedDuration: 60,
				originalDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
				reason: "Minor healing issue, complimentary fix",
			})
		);

		appointments.push(
			await ConsultationAppointment.create({
				userId: user._id,
				date: getDateThisWeek(4), // Friday
				title: "Sleeve Planning",
				startTime: "14:00",
				endTime: "15:30",
				clientName: "David Lee",
				clientEmail: "david.l@example.com",
				clientPhone: "+49 222 333444",
				depositPaid: true,
				estimatedDuration: 90,
				consultationType: "Design Session",
				notes: "Planning full sleeve with mixed styles - floral and geometric",
			})
		);

		// Saturday: Short session
		appointments.push(
			await NewTattooAppointment.create({
				userId: user._id,
				date: getDateThisWeek(5), // Saturday
				title: "Small Design",
				startTime: "10:30",
				endTime: "12:00",
				clientName: "Sophie Miller",
				clientEmail: "sophie.m@example.com",
				clientPhone: "+49 555 666777",
				depositPaid: true,
				estimatedDuration: 90,
				bodyPart: "Behind Ear",
				style: "Fine Line",
				description: "Delicate fine line butterfly",
			})
		);

		console.log(`\n✅ Created ${appointments.length} example appointments for this week:`);
		console.log(`- Monday: 1 appointment (full day new tattoo)`);
		console.log(`- Tuesday: 2 appointments (consultation + touch-up)`);
		console.log(`- Wednesday: 3 appointments (new tattoos + lunch blocker)`);
		console.log(`- Thursday: 3 appointments (consultation + 2 new tattoos)`);
		console.log(`- Friday: 2 appointments (touch-up + consultation)`);
		console.log(`- Saturday: 1 appointment (small new tattoo)`);
		console.log(`\n✅ Workdays configuration:`);
		console.log(`- Monday-Friday: 9:00 AM - 6:00 PM`);
		console.log(`- Saturday: 10:00 AM - 2:00 PM`);
		console.log(`- Sunday: Off`);

		await mongoose.disconnect();
		console.log("\n✅ Database connection closed - Data seeded successfully!");
	} catch (error) {
		console.error("❌ Error seeding data:", error);
		await mongoose.disconnect();
		process.exit(1);
	}
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
	console.error("Usage: npm run seed-example -- <user-email>");
	console.error("\nExample: npm run seed-example -- steffen@test.com");
	process.exit(1);
}

seedExampleData(email);
