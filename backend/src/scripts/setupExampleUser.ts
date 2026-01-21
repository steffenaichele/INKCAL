import "#db";
import { User, Appointment, Workdays } from "#models";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const setupExampleUser = async () => {
	try {
		console.log("🧹 Starting database setup...");

		// Keep only code@freeze.de user
		const keepEmail = "code@freeze.de";

		// Delete all users except code@freeze.de
		const deletedUsers = await User.deleteMany({
			email: { $ne: keepEmail },
		});
		console.log(`✅ Deleted ${deletedUsers.deletedCount} users (kept ${keepEmail})`);

		// Find or create code@freeze.de user
		let user = await User.findOne({ email: keepEmail });

		if (!user) {
			console.log(`Creating user ${keepEmail}...`);
			const hashedPassword = await bcrypt.hash("password123", 10);
			user = await User.create({
				name: "Example User",
				email: keepEmail,
				password: hashedPassword,
			});
			console.log(`✅ Created user: ${user.name} (${user.email})`);
		} else {
			console.log(`✅ Found existing user: ${user.name} (${user.email})`);
		}

		// Delete all existing appointments
		const deletedAppointments = await Appointment.deleteMany({});
		console.log(`✅ Deleted ${deletedAppointments.deletedCount} old appointments`);

		// Create example appointments for the next 2 weeks
		const today = new Date();
		const appointments = [];

		// Week 1: Monday - New Tattoo
		const monday1 = new Date(today);
		monday1.setDate(today.getDate() + ((1 - today.getDay() + 7) % 7));
		appointments.push({
			userId: user._id,
			appointmentType: "NewTattoo",
			title: "Dragon Sleeve Session 1",
			clientName: "Sarah Miller",
			date: monday1.toISOString().split("T")[0],
			startTime: "10:00",
			endTime: "14:00",
			designDescription: "Traditional Japanese dragon sleeve, first session on upper arm",
			placement: "Right upper arm",
			size: "Full sleeve (first session)",
			color: true,
			contact: {
				contactType: "Instagram",
				contactValue: "@sarahmiller_ink",
			},
		});

		// Week 1: Wednesday - Consultation
		const wednesday1 = new Date(monday1);
		wednesday1.setDate(monday1.getDate() + 2);
		appointments.push({
			userId: user._id,
			appointmentType: "Consultation",
			title: "Memorial Tattoo Consultation",
			clientName: "James Anderson",
			date: wednesday1.toISOString().split("T")[0],
			startTime: "15:00",
			endTime: "16:00",
			contact: {
				contactType: "WhatsApp",
				contactValue: "+491701234567",
			},
		});

		// Week 1: Friday - TouchUp
		const friday1 = new Date(monday1);
		friday1.setDate(monday1.getDate() + 4);
		appointments.push({
			userId: user._id,
			appointmentType: "TouchUp",
			title: "Rose Tattoo Touch-Up",
			clientName: "Emma Wilson",
			date: friday1.toISOString().split("T")[0],
			startTime: "11:00",
			endTime: "12:30",
			contact: {
				contactType: "EMail",
				contactValue: "emma.wilson@email.com",
			},
		});

		// Week 1: Saturday - Blocker
		const saturday1 = new Date(monday1);
		saturday1.setDate(monday1.getDate() + 5);
		appointments.push({
			userId: user._id,
			appointmentType: "Blocker",
			title: "Studio Setup & Planning",
			clientName: "Personal Time",
			date: saturday1.toISOString().split("T")[0],
			startTime: "09:00",
			endTime: "12:00",
		});

		// Week 2: Tuesday - New Tattoo
		const monday2 = new Date(monday1);
		monday2.setDate(monday1.getDate() + 7);
		const tuesday2 = new Date(monday2);
		tuesday2.setDate(monday2.getDate() + 1);
		appointments.push({
			userId: user._id,
			appointmentType: "NewTattoo",
			title: "Geometric Back Piece",
			clientName: "Michael Chen",
			date: tuesday2.toISOString().split("T")[0],
			startTime: "13:00",
			endTime: "17:00",
			designDescription: "Sacred geometry mandala with dotwork shading",
			placement: "Upper back",
			size: "Medium (20x20cm)",
			color: false,
			contact: {
				contactType: "Instagram",
				contactValue: "@chen_geometry",
			},
		});

		// Week 2: Thursday - Consultation
		const thursday2 = new Date(monday2);
		thursday2.setDate(monday2.getDate() + 3);
		appointments.push({
			userId: user._id,
			appointmentType: "Consultation",
			title: "Custom Lettering Design",
			clientName: "Lisa Brown",
			date: thursday2.toISOString().split("T")[0],
			startTime: "16:00",
			endTime: "17:00",
			contact: {
				contactType: "WhatsApp",
				contactValue: "+491709876543",
			},
		});

		// Week 2: Friday - New Tattoo
		const friday2 = new Date(monday2);
		friday2.setDate(monday2.getDate() + 4);
		appointments.push({
			userId: user._id,
			appointmentType: "NewTattoo",
			title: "Minimalist Nature Scene",
			clientName: "Alex Turner",
			date: friday2.toISOString().split("T")[0],
			startTime: "10:00",
			endTime: "13:00",
			designDescription: "Fine line mountain landscape with pine trees",
			placement: "Forearm",
			size: "Small (10x15cm)",
			color: false,
			contact: {
				contactType: "EMail",
				contactValue: "alex.turner@email.com",
			},
		});

		// Create all appointments
		const createdAppointments = await Appointment.insertMany(appointments);
		console.log(`✅ Created ${createdAppointments.length} example appointments`);

		// Setup workdays if they don't exist
		let workdays = await Workdays.findOne({ userId: user._id });
		if (!workdays) {
			workdays = await Workdays.create({
				userId: user._id,
				timezone: "Europe/Berlin",
				workdays: [
					{ dayOfWeek: "monday", isWorkday: true, startTime: "09:00", endTime: "17:00" },
					{ dayOfWeek: "tuesday", isWorkday: true, startTime: "09:00", endTime: "17:00" },
					{ dayOfWeek: "wednesday", isWorkday: true, startTime: "09:00", endTime: "17:00" },
					{ dayOfWeek: "thursday", isWorkday: true, startTime: "09:00", endTime: "17:00" },
					{ dayOfWeek: "friday", isWorkday: true, startTime: "09:00", endTime: "17:00" },
					{ dayOfWeek: "saturday", isWorkday: false, startTime: "09:00", endTime: "17:00" },
					{ dayOfWeek: "sunday", isWorkday: false, startTime: "09:00", endTime: "17:00" },
				],
			});
			console.log(`✅ Created workdays configuration`);
		} else {
			console.log(`✅ Workdays already configured`);
		}

		console.log("\n🎉 Database setup completed!");
		console.log(`\n📧 Login with:`);
		console.log(`   Email: ${keepEmail}`);
		console.log(`   Password: password123`);

		// Close connection
		await mongoose.connection.close();
		console.log("\n👋 Database connection closed");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error during setup:", error);
		process.exit(1);
	}
};

setupExampleUser();
