import { useAuth } from "@/context";
import { Navigate } from "react-router";
import Clock from "@/components/Clock";
import Calendar from "@/components/Calendar";
import "@/styles/pages/Dashboard.scss";

const Dashboard = () => {
	const { signedIn, user } = useAuth();

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
		</div>
	);
};

export default Dashboard;
