import { useState } from "react";
import { useAuth } from "@/context";
import { Navigate, useNavigate } from "react-router";
import { useLayout } from "@/components/Layout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "@/services/api/appointments";
import Header from "@/components/Header";
import Calendar from "@/components/Calendar";
import Icon from "@/components/Icon";
import { Button } from "@/components/ui/Button";
import CreateAppointmentDialog from "@/components/CreateAppointmentDialog";
import type { Appointment } from "@/types/api";
import "@/styles/pages/Dashboard.scss";

const Dashboard = () => {
	const { signedIn, user } = useAuth();
	const navigate = useNavigate();
	const { openSettings } = useLayout();
	const queryClient = useQueryClient();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

	const deleteMutation = useMutation({
		mutationFn: (appointmentId: string) => appointmentsApi.delete(appointmentId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["appointments", user?._id],
			});
		},
		onError: (error: any) => {
			console.error("Failed to delete appointment:", error);
			alert("Failed to delete appointment. Please try again.");
		},
	});

	const handleCreateAppointment = () => {
		setEditingAppointment(null);
		setIsDialogOpen(true);
	};

	const handleEditAppointment = (appointment: Appointment) => {
		setEditingAppointment(appointment);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = (open: boolean) => {
		setIsDialogOpen(open);
		if (!open) {
			setEditingAppointment(null);
		}
	};

	const handleDeleteAppointment = (appointment: Appointment) => {
		if (window.confirm(`Are you sure you want to delete "${appointment.title}"?`)) {
			deleteMutation.mutate(appointment._id);
		}
	};

	if (!signedIn || !user) {
		return <Navigate to="/login" replace />;
	}

	return (
		<>
			<div className="dashboard">
				<Header />
				<Calendar
					userId={user._id}
					onEditAppointment={handleEditAppointment}
					onDeleteAppointment={handleDeleteAppointment}
				/>
				<div className="dashboard__actions">
					<Button
						className="dashboard__settings-button"
						onClick={openSettings}
						variant="secondary">
						<Icon name="Settings" size={20} />
						Settings
					</Button>
					<Button
						className="dashboard__create-button"
						onClick={handleCreateAppointment}>
						New Appointment
					</Button>
				</div>
			</div>
			<CreateAppointmentDialog
				open={isDialogOpen}
				onOpenChange={handleCloseDialog}
				appointment={editingAppointment}
			/>
		</>
	);
};

export default Dashboard;
