import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { createBlendy } from "blendy";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from "react";
import type { Appointment } from "@/types/api";

export interface AppointmentCardProps {
	appointment: Appointment;
	style?: CSSProperties;
	onEdit?: (appointment: Appointment) => void;
	onDelete?: (appointment: Appointment) => void;
}

const overlayStyle: CSSProperties = {
	position: "fixed",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	background: "rgba(0,0,0,0.25)",
	zIndex: 1000,
};

const modalStyle: CSSProperties = {
	background: "#fff",
	padding: "16px",
	borderRadius: 8,
	boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
	minWidth: 260,
	maxWidth: "90vw",
};

const cardBaseStyle: CSSProperties = {
	border: "1px solid #ddd",
	borderRadius: 6,
	padding: "10px 12px",
	cursor: "pointer",
	background: "#fff",
	boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const AppointmentCard = ({
	appointment,
	style,
	onEdit,
	onDelete,
}: AppointmentCardProps) => {
	const blendy = useRef<ReturnType<typeof createBlendy> | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const blendyId = `appointment-${appointment._id}`;

	useEffect(() => {
		blendy.current = createBlendy({ animation: "dynamic" });
	}, []);

	const openModal = () => {
		setIsModalOpen(true);
		setTimeout(() => {
			blendy.current?.update();
			blendy.current?.toggle(blendyId);
		}, 0);
	};

	const closeModal = () => {
		blendy.current?.untoggle(blendyId, () => {
			setIsModalOpen(false);
		});
	};

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isModalOpen) {
				closeModal();
			}
		};

		if (isModalOpen) {
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isModalOpen]);

	const handleKeyDown = (e: ReactKeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			openModal();
		}
	};

	const appointmentDate = new Date(appointment.date);
	const formattedDate = appointmentDate.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const timeRange = `${appointment.startTime} - ${appointment.endTime}`;
	const showClient = appointment.appointmentType !== "Blocker";
	const clientName = showClient ? appointment.clientName : null;

	const handleEdit = () => {
		onEdit?.(appointment);
		closeModal();
	};

	const handleDelete = () => {
		onDelete?.(appointment);
		closeModal();
	};

	return (
		<>
			{isModalOpen &&
				createPortal(
					<div onClick={closeModal} style={overlayStyle}>
						<div
							data-blendy-to={blendyId}
							onClick={(e) => e.stopPropagation()}
							style={modalStyle}>
							<h2>{appointment.title}</h2>
							<p>{formattedDate}</p>
							<p>{timeRange}</p>
							{clientName && <p>Client: {clientName}</p>}
							<div
								style={{
									display: "flex",
									gap: 8,
									marginTop: 12,
								}}>
								<button
									onClick={handleEdit}
									aria-label="Edit appointment">
									Edit
								</button>
								<button
									onClick={handleDelete}
									aria-label="Delete appointment">
									Delete
								</button>
							</div>
							<button
								onClick={closeModal}
								aria-label="Close modal">
								Close
							</button>
						</div>
					</div>,
					document.body,
				)}

			<div
				data-blendy-from={blendyId}
				style={{ ...cardBaseStyle, ...style }}
				onClick={openModal}
				onKeyDown={handleKeyDown}
				role="button"
				tabIndex={0}
				title={`${appointment.title} - ${timeRange}${clientName ? ` - ${clientName}` : ""}`}>
				<div>{appointment.appointmentType}</div>
				<div>{timeRange}</div>
				<div>{appointment.title}</div>
				{clientName && <div>{clientName}</div>}
			</div>
		</>
	);
};

export default AppointmentCard;
