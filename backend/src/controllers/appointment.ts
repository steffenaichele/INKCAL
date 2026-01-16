import {
	Appointment,
	NewTattooAppointment,
	TouchUpAppointment,
	ConsultationAppointment,
	BlockerAppointment,
} from "#models";
import type {
	NewTattooAppointmentInputDTO,
	TouchUpAppointmentInputDTO,
	ConsultationAppointmentInputDTO,
	BlockerAppointmentInputDTO,
} from "#schemas";
import type { RequestHandler } from "express";

type AppointmentInputDTO =
	| NewTattooAppointmentInputDTO
	| TouchUpAppointmentInputDTO
	| ConsultationAppointmentInputDTO
	| BlockerAppointmentInputDTO;

// GET /appointments?userId=...&appointmentType=...
const getAllAppointments: RequestHandler = async (req, res) => {
	const { userId, appointmentType } = req.query;

	const filter: Record<string, any> = {};

	if (userId) {
		filter.userId = userId;
	}

	if (appointmentType) {
		filter.appointmentType = appointmentType;
	}

	const appointments = await Appointment.find(filter);
	res.json(appointments);
};

// POST /appointments
const createAppointment: RequestHandler<
	{},
	any,
	AppointmentInputDTO & { appointmentType: string }
> = async (req, res) => {
	const { appointmentType, ...appointmentData } = req.body;

	let newAppointment;

	switch (appointmentType) {
		case "NewTattoo":
			newAppointment = await NewTattooAppointment.create(appointmentData as any);
			break;
		case "TouchUp":
			newAppointment = await TouchUpAppointment.create(appointmentData as any);
			break;
		case "Consultation":
			newAppointment = await ConsultationAppointment.create(
				appointmentData as any
			);
			break;
		case "Blocker":
			newAppointment = await BlockerAppointment.create(appointmentData as any);
			break;
		default:
			throw new Error(`Invalid appointment type: ${appointmentType}`, {
				cause: 400,
			});
	}

	res.status(201).json(newAppointment);
};

// GET /appointments/:id
const getAppointmentById: RequestHandler<{ id: string }> = async (req, res) => {
	const { id } = req.params;
	const appointment = await Appointment.findById(id);
	if (!appointment) throw new Error("Appointment not found", { cause: 404 });
	res.json(appointment);
};

// PUT /appointments/:id
const updateAppointment: RequestHandler<
	{ id: string },
	any,
	Partial<AppointmentInputDTO & { appointmentType: string }>
> = async (req, res) => {
	const { id } = req.params;
	const { appointmentType, ...appointmentData } = req.body;

	const existingAppointment = await Appointment.findById(id);
	if (!existingAppointment)
		throw new Error("Appointment not found", { cause: 404 });

	let updatedAppointment;

	if (
		appointmentType &&
		appointmentType !== existingAppointment.get("appointmentType")
	) {
		await existingAppointment.deleteOne();

		switch (appointmentType) {
			case "NewTattoo":
				updatedAppointment = await NewTattooAppointment.create({
					...appointmentData,
					_id: id,
				} as any);
				break;
			case "TouchUp":
				updatedAppointment = await TouchUpAppointment.create({
					...appointmentData,
					_id: id,
				} as any);
				break;
			case "Consultation":
				updatedAppointment = await ConsultationAppointment.create({
					...appointmentData,
					_id: id,
				} as any);
				break;
			case "Blocker":
				updatedAppointment = await BlockerAppointment.create({
					...appointmentData,
					_id: id,
				} as any);
				break;
			default:
				throw new Error(
					`Invalid appointment type: ${appointmentType}`,
					{ cause: 400 }
				);
		}
	} else {
		updatedAppointment = await Appointment.findByIdAndUpdate(
			id,
			appointmentData,
			{ new: true }
		);
	}

	res.json(updatedAppointment);
};

// DELETE /appointments/:id
const deleteAppointment: RequestHandler<
	{ id: string },
	{ message: string }
> = async (req, res) => {
	const { id } = req.params;
	const foundAppointment = await Appointment.findByIdAndDelete(id);
	if (!foundAppointment)
		throw new Error("Appointment not found", { cause: 404 });
	res.json({ message: "Appointment deleted" });
};

export {
	getAllAppointments,
	createAppointment,
	getAppointmentById,
	updateAppointment,
	deleteAppointment,
};
