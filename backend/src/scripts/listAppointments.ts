import "#db";
import { Appointment } from "#models";

async function listAppointments() {
  try {
    console.log('Connected to database\n');

    const appointments = await Appointment.find().sort({ date: 1 });

    console.log(`Found ${appointments.length} appointment(s):\n`);

    appointments.forEach((apt: typeof Appointment.prototype, index: number) => {
      console.log(`${index + 1}. ${apt.title}`);
      console.log(`   Date: ${apt.date}`);
      console.log(`   Time: ${apt.startTime} - ${apt.endTime}`);
      console.log(`   Type: ${apt.appointmentType}`);
      console.log(`   User ID: ${apt.userId}`);
      console.log('');
    });

    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listAppointments();
