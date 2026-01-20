import { useAuth } from "@/context";
import { Navigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { appointmentsApi } from "@/services/api/appointments";
import Clock from "@/components/Clock";
import Calendar from "@/components/Calendar";
import AppointmentList from "@/components/AppointmentList";
import "@/styles/pages/Dashboard.scss";

const Dashboard = () => {
	const { signedIn, user } = useAuth();

	// Fetch appointments for the logged-in user
	const {
		data: appointments,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["appointments", user?._id],
		queryFn: () =>
			user
				? appointmentsApi.getAll({ userId: user._id })
				: Promise.resolve([]),
		enabled: !!user,
	});

	if (!signedIn || !user) {
		return <Navigate to="/login" replace />;
	}

	return (
		<div className="dashboard">
			<h1 className="dashboard__title">Welcome, {user.name}!</h1>

			<div className="dashboard__clock">
				<Clock />
			</div>

			<div className="dashboard__calendar">
				<Calendar userId={user._id} />
			</div>

			{/* <AppointmentList
				appointments={appointments || []}
				isLoading={isLoading}
				error={error}
			/> */}
		</div>
	);
};

export default Dashboard;
