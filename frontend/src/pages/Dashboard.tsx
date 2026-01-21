import { useState } from "react";
import { useAuth } from "@/context";
import { Navigate, useNavigate } from "react-router";
import Header from "@/components/Header";
import Calendar from "@/components/Calendar";
import { Button } from "@/components/ui/Button";
import CreateAppointmentDialog from "@/components/CreateAppointmentDialog";
import "@/styles/pages/Dashboard.scss";

const Dashboard = () => {
	const { signedIn, user } = useAuth();
	const navigate = useNavigate();
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	if (!signedIn || !user) {
		return <Navigate to="/login" replace />;
	}

	return (
		<>
			<div className="dashboard">
				<Header />
				<Calendar userId={user._id} />

				<div className="dashboard__actions">
					<Button
						variant="primary"
						onClick={() => setIsCreateOpen(true)}>
						New appointment
					</Button>
					<Button
						variant="secondary"
						size="sm"
						onClick={() => navigate("/profile")}>
						Settings
					</Button>
				</div>
			</div>
			<CreateAppointmentDialog
				open={isCreateOpen}
				onOpenChange={setIsCreateOpen}
			/>
		</>
	);
};

export default Dashboard;
