import React, { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Form } from "@base-ui/react/form";
import { Field } from "@base-ui/react/field";
import { Button } from "./ui/Button/Button";
import "./CreateAppointmentDialog.scss";

interface CreateAppointmentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
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
	({ open, onOpenChange }: CreateAppointmentDialogProps) => {
		const [formErrors, setFormErrors] = useState<{
			title?: string;
			date?: string;
			startTime?: string;
			endTime?: string;
			type?: string;
		}>({});

		const closeModal = () => onOpenChange(false);

		const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setFormErrors({});

			const formData = new FormData(e.currentTarget);
			const appointmentData = {
				title: formData.get("title") as string,
				date: formData.get("date") as string,
				startTime: formData.get("startTime") as string,
				endTime: formData.get("endTime") as string,
				type: formData.get("type") as string,
			};

			console.log("Creating appointment:", appointmentData);
			// TODO: wire to appointments API

			closeModal();
		};

		return (
			<Dialog.Root open={open} onOpenChange={onOpenChange}>
				<Dialog.Portal>
					<Dialog.Backdrop className="create-appointment__backdrop" />
					<Dialog.Popup className="create-appointment__popup">
						<div className="create-appointment__content">
							<Dialog.Title className="create-appointment__title">
								New appointment
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
										className="create-appointment__field-input"
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
										className="create-appointment__field-input"
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
												defaultChecked={index === 0}
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

								<div className="create-appointment__form-actions">
									<Button
										variant="ghost"
										type="button"
										onClick={closeModal}>
										Cancel
									</Button>
									<Button variant="primary" type="submit">
										Save
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
