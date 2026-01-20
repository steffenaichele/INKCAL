import { useAuth } from "@/context";
import { Navigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { appointmentsApi } from "@/services/api/appointments";
import type { Appointment } from "@/types/api";
import Clock from "@/components/Clock";

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

	return (
		<div style={{ maxWidth: "1200px", margin: "20px auto", padding: "20px" }}>
			<h1>Welcome, {user.name}!</h1>

			<Clock />

			<div style={{ marginTop: "30px" }}>
				<h2>Your Appointments</h2>

				{isLoading && <p>Loading appointments...</p>}

				{error && (
					<div style={{ color: "red", padding: "10px", backgroundColor: "#ffebee", borderRadius: "4px" }}>
						Error loading appointments: {error instanceof Error ? error.message : "Unknown error"}
					</div>
				)}

				{!isLoading && !error && appointments && appointments.length === 0 && (
					<p style={{ color: "#666", fontStyle: "italic" }}>
						No appointments found. Create your first appointment!
					</p>
				)}

				{!isLoading && !error && appointments && appointments.length > 0 && (
					<div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
						{appointments.map((appointment: Appointment) => (
							<div
								key={appointment._id}
								style={{
									border: "1px solid #ddd",
									borderRadius: "8px",
									padding: "20px",
									backgroundColor: "#fff",
									boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
								}}
							>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
									<div>
										<h3 style={{ margin: "0 0 10px 0" }}>{appointment.title}</h3>
										<div style={{ color: "#666", fontSize: "14px" }}>
											<p style={{ margin: "5px 0" }}>
												<strong>Type:</strong> {appointment.appointmentType}
											</p>
											<p style={{ margin: "5px 0" }}>
												<strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
											</p>
											<p style={{ margin: "5px 0" }}>
												<strong>Time:</strong> {appointment.startTime} - {appointment.endTime}
											</p>
											{appointment.appointmentType !== "Blocker" && (
												<p style={{ margin: "5px 0" }}>
													<strong>Client:</strong> {appointment.clientName}
												</p>
											)}
										</div>
									</div>
									<span
										style={{
											padding: "4px 12px",
											borderRadius: "12px",
											fontSize: "12px",
											fontWeight: "bold",
											backgroundColor: getAppointmentTypeColor(appointment.appointmentType),
											color: "#fff"
										}}
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
