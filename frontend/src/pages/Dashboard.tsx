import { useAuth } from "@/context";
import { Navigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { appointmentsApi } from "@/services/api/appointments";
import type { Appointment } from "@/types/api";
import Clock from "@/components/Clock";
import Calendar from "@/components/Calendar";
import "@/styles/pages/Dashboard.scss";

const Dashboard = () => {
	const { signedIn, user } = useAuth();

	// Fetch appointments for the logged-in user
	const { data: appointments, isLoading, error } = useQuery({
		queryKey: ['appointments', user?._id],
		queryFn: () => user ? appointmentsApi.getAll({ userId: user._id }) : Promise.resolve([]),
		enabled: !!user,
	});

	if (!signedIn || !user) {
		return <Navigate to="/login" replace />;
	}

	const handleAppointmentClick = (appointment: Appointment) => {
		// TODO: Open appointment details modal or navigate to edit page
		console.log('Appointment clicked:', appointment);
	};

	return (
		<div className="dashboard">
			<h1>Welcome, {user.name}!</h1>

			<div className="dashboard__widgets">
				<Clock />
			</div>

			<div className="dashboard__calendar">
				<Calendar userId={user._id} onAppointmentClick={handleAppointmentClick} />
			</div>

			<div className="dashboard__appointments-list">
				<h2>Your Appointments</h2>

				{isLoading && <p>Loading appointments...</p>}

				{error && (
					<div className="dashboard__error">
						Error loading appointments: {error instanceof Error ? error.message : "Unknown error"}
					</div>
				)}

				{!isLoading && !error && appointments && appointments.length === 0 && (
					<p className="dashboard__empty">
						No appointments found. Create your first appointment!
					</p>
				)}

				{!isLoading && !error && appointments && appointments.length > 0 && (
					<div className="dashboard__appointment-grid">
						{appointments.map((appointment: Appointment) => (
							<div key={appointment._id} className="dashboard__appointment-card">
								<div className="dashboard__appointment-content">
									<div>
										<h3>{appointment.title}</h3>
										<div className="dashboard__appointment-details">
											<p>
												<strong>Type:</strong> {appointment.appointmentType}
											</p>
											<p>
												<strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
											</p>
											<p>
												<strong>Time:</strong> {appointment.startTime} - {appointment.endTime}
											</p>
											{appointment.appointmentType !== "Blocker" && (
												<p>
													<strong>Client:</strong> {appointment.clientName}
												</p>
											)}
										</div>
									</div>
									<span
										className="dashboard__appointment-badge"
										style={{ backgroundColor: getAppointmentTypeColor(appointment.appointmentType) }}
									>
										{appointment.appointmentType}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

// Helper function to get color based on appointment type
const getAppointmentTypeColor = (type: string): string => {
	switch (type) {
		case "NewTattoo":
			return "#4caf50";
		case "TouchUp":
			return "#2196f3";
		case "Consultation":
			return "#ff9800";
		case "Blocker":
			return "#9e9e9e";
		default:
			return "#757575";
	}
};

export default Dashboard;
