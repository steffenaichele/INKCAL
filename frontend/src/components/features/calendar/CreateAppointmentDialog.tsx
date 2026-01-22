import React, { useState, useEffect } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Form } from "@base-ui/react/form";
import { Field } from "@base-ui/react/field";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context";
import { appointmentsApi } from "@/services/api/appointments";
import type { Appointment, AppointmentType } from "@/types/api";
import { Button } from "@/components/ui/Button/Button";
import "./CreateAppointmentDialog.scss";

interface CreateAppointmentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	appointment?: Appointment | null;
}

const appointmentTypes = [
	{ value: "Consultation", label: "Consultation", hint: "Prep and planning" },
	{
		value: "NewTattoo",
		label: "New Tattoo",
		hint: "Full new tattoo session",
	},
	{
		value: "TouchUp",
		label: "Touch Up",
		hint: "Follow-up for existing work",
	},
	{ value: "Blocker", label: "Blocker", hint: "Reserve time (no client)" },
];

const CreateAppointmentDialog = React.memo(
	({ open, onOpenChange, appointment }: CreateAppointmentDialogProps) => {
		const { user } = useAuth();
		const queryClient = useQueryClient();
		const isEditMode = !!appointment;
		const [selectedType, setSelectedType] = useState<AppointmentType>(
			appointment?.appointmentType || "Consultation"
		);
		const [formErrors, setFormErrors] = useState<{
			title?: string;
			date?: string;
			startTime?: string;
			endTime?: string;
			type?: string;
			clientName?: string;
			contactValue?: string;
		}>({});

		// Update selected type when appointment changes
		useEffect(() => {
			if (appointment) {
				setSelectedType(appointment.appointmentType);
			} else {
				setSelectedType("Consultation");
			}
		}, [appointment]);

		const showClientFields = selectedType !== "Blocker";

		const createMutation = useMutation({
			mutationFn: appointmentsApi.create,
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: ["appointments", user?._id],
				});
				closeModal();
			},
			onError: (error: any) => {
				console.error("Failed to create appointment:", error);
				setFormErrors({
					title: error.message || "Failed to create appointment",
				});
			},
		});

		const updateMutation = useMutation({
			mutationFn: ({ id, data }: { id: string; data: any }) =>
				appointmentsApi.update(id, data),
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: ["appointments", user?._id],
				});
				closeModal();
			},
			onError: (error: any) => {
				console.error("Failed to update appointment:", error);
				setFormErrors({
					title: error.message || "Failed to update appointment",
				});
			},
		});

		const mutation = isEditMode ? updateMutation : createMutation;

		const closeModal = () => onOpenChange(false);

		const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setFormErrors({});

			if (!user) {
				setFormErrors({ title: "User not authenticated" });
				return;
			}

			const formData = new FormData(e.currentTarget);
			const appointmentType = formData.get("type") as AppointmentType;

			// Build base appointment data
			const baseData = {
				userId: user._id,
				title: formData.get("title") as string,
				date: formData.get("date") as string,
				startTime: formData.get("startTime") as string,
				endTime: formData.get("endTime") as string,
				appointmentType,
			};

			// Add type-specific fields based on appointment type
			let appointmentData: any = { ...baseData };

			if (appointmentType === "Blocker") {
				appointmentData.clientName = "N/A";
			} else {
				// Get client information from form
				const clientName = formData.get("clientName") as string;
				const contactType = formData.get("contactType") as string;
				const contactValue = formData.get("contactValue") as string;

				if (!clientName || !contactValue) {
					setFormErrors({
						clientName: !clientName ? "Client name is required" : undefined,
						contactValue: !contactValue ? "Contact information is required" : undefined,
					});
					return;
				}

				appointmentData.clientName = clientName;
				appointmentData.contact = {
					contactType: contactType || "EMail",
					contactValue: contactValue,
				};

				// Preserve additional fields in edit mode
				if (isEditMode && appointment) {
					if ("designDescription" in appointment) {
						appointmentData.designDescription = appointment.designDescription;
					}
					if ("placement" in appointment) {
						appointmentData.placement = appointment.placement;
					}
					if ("size" in appointment) {
						appointmentData.size = appointment.size;
					}
					if ("color" in appointment) {
						appointmentData.color = appointment.color;
					}
				} else if (appointmentType === "NewTattoo") {
					// For new tattoo appointments, add placeholder design description
					appointmentData.designDescription = "To be discussed";
				}
			}

			if (isEditMode && appointment) {
				updateMutation.mutate({ id: appointment._id, data: appointmentData });
			} else {
				createMutation.mutate(appointmentData);
			}
		};

		return (
			<Dialog.Root open={open} onOpenChange={onOpenChange}>
				<Dialog.Portal>
					<Dialog.Backdrop className="create-appointment__backdrop" />
					<Dialog.Popup className="create-appointment__popup">
						<div className="create-appointment__content">
							<Dialog.Title className="create-appointment__title">
								{isEditMode ? "Edit appointment" : "New appointment"}
							</Dialog.Title>

							<Form
								className="create-appointment__form"
								onSubmit={handleSubmit}
								errors={formErrors}>
								<Field.Root
									name="title"
									className="create-appointment__field">
									<Field.Label className="create-appointment__field-label">
										Title
									</Field.Label>
									<Field.Control
										required
										placeholder="Appointment title"
										className="create-appointment__field-input"
										defaultValue={appointment?.title || ""}
									/>
									<Field.Error className="create-appointment__field-error" />
								</Field.Root>

								<Field.Root
									name="date"
									className="create-appointment__field">
									<Field.Label className="create-appointment__field-label">
										Date
									</Field.Label>
									<Field.Control
										type="date"
										required
										className="create-appointment__field-input"
										defaultValue={appointment?.date || ""}
									/>
									<Field.Error className="create-appointment__field-error" />
								</Field.Root>

								<Field.Root
									name="startTime"
									className="create-appointment__field">
									<Field.Label className="create-appointment__field-label">
										Start time
									</Field.Label>
									<Field.Control
										type="time"
										required
										step="900"
										className="create-appointment__field-input"
										defaultValue={appointment?.startTime || ""}
									/>
									<Field.Error className="create-appointment__field-error" />
								</Field.Root>

								<Field.Root
									name="endTime"
									className="create-appointment__field">
									<Field.Label className="create-appointment__field-label">
										End time
									</Field.Label>
									<Field.Control
										type="time"
										required
										step="900"
										className="create-appointment__field-input"
										defaultValue={appointment?.endTime || ""}
									/>
									<Field.Error className="create-appointment__field-error" />
								</Field.Root>

								<fieldset className="create-appointment__radio-group">
									<legend className="create-appointment__field-label">
										Type
									</legend>
									{appointmentTypes.map((option, index) => (
										<label
											key={option.value}
											className="create-appointment__radio-option">
											<input
												type="radio"
												name="type"
												value={option.value}
												defaultChecked={
													appointment
														? appointment.appointmentType === option.value
														: index === 0
												}
												onChange={(e) => setSelectedType(e.target.value as AppointmentType)}
												required
											/>
											<span className="create-appointment__radio-label">
												{option.label}
											</span>
											<span className="create-appointment__radio-hint">
												{option.hint}
											</span>
										</label>
									))}
								</fieldset>

								{showClientFields && (
									<>
										<Field.Root
											name="clientName"
											className="create-appointment__field">
											<Field.Label className="create-appointment__field-label">
												Client Name
											</Field.Label>
											<Field.Control
												required
												placeholder="Enter client name"
												className="create-appointment__field-input"
												defaultValue={
													appointment && "clientName" in appointment
														? appointment.clientName
														: ""
												}
											/>
											<Field.Error className="create-appointment__field-error" />
										</Field.Root>

										<Field.Root
											name="contactType"
											className="create-appointment__field">
											<Field.Label className="create-appointment__field-label">
												Contact Type
											</Field.Label>
											<select
												name="contactType"
												className="create-appointment__field-input"
												defaultValue={
													appointment && "contact" in appointment
														? appointment.contact.contactType
														: "EMail"
												}>
												<option value="EMail">Email</option>
												<option value="WhatsApp">WhatsApp</option>
												<option value="Instagram">Instagram</option>
											</select>
											<Field.Error className="create-appointment__field-error" />
										</Field.Root>

										<Field.Root
											name="contactValue"
											className="create-appointment__field">
											<Field.Label className="create-appointment__field-label">
												Contact Information
											</Field.Label>
											<Field.Control
												required
												placeholder="Enter email, phone, or Instagram handle"
												className="create-appointment__field-input"
												defaultValue={
													appointment && "contact" in appointment
														? appointment.contact.contactValue
														: ""
												}
											/>
											<Field.Error className="create-appointment__field-error" />
										</Field.Root>
									</>
								)}

								<div className="create-appointment__form-actions">
									<Button
										variant="ghost"
										type="button"
										onClick={closeModal}
										disabled={mutation.isPending}>
										Cancel
									</Button>
									<Button
										variant="primary"
										type="submit"
										loading={mutation.isPending}
										disabled={mutation.isPending}>
										{mutation.isPending
											? isEditMode
												? "Updating..."
												: "Creating..."
											: "Save"}
									</Button>
								</div>
							</Form>
						</div>
					</Dialog.Popup>
				</Dialog.Portal>
			</Dialog.Root>
		);
	},
);

CreateAppointmentDialog.displayName = "CreateAppointmentDialog";

export default CreateAppointmentDialog;
