import { z } from "zod/v4";
import { isValidObjectId, Types } from "mongoose";

const minClientNameLength = 2;
const minTitleLength = 3;
const minDescriptionLength = 5;

const dbEntrySchema = z.strictObject({
    _id: z.instanceof(Types.ObjectId),
    createdAt: z.date(),
    updatedAt: z.date(),
    __v: z.int().nonnegative(),
});

export const appointmentParamsSchema = z.strictObject({
    appointmentId: z.string().refine((val) => isValidObjectId(val), "Invalid appointment ID"),
});

// Basis Appointment Input Schema
const baseAppointmentInputSchema = z.object({
    userId: z.string().refine((val) => isValidObjectId(val), "Invalid user ID"),
    date: z.date(),
    title: z.string().min(minTitleLength, `Title must be at least ${minTitleLength} characters long`),
    startTime: z.string(),
    endTime: z.string(),
});

// New Tattoo Appointment Input Schema
export const newTattooAppointmentInputSchema = baseAppointmentInputSchema.extend({
    clientName: z.string().min(minClientNameLength, `Client name must be at least ${minClientNameLength}} characters long`),
    designDescription: z.string().min(minDescriptionLength, `Design description must be at least ${minDescriptionLength} characters long`),
    placement: z.string().optional(),
    size: z.string().optional(),
    color: z.boolean().optional(),
});

export const newTattooAppointmentSchema = z.object({
    ...newTattooAppointmentInputSchema.shape,
    ...dbEntrySchema.shape,
    type: z.literal("NewTattoo"),
});

// Touch-Up Appointment Input Schema
export const touchUpAppointmentInputSchema = baseAppointmentInputSchema.extend({
    clientName: z.string().min(minClientNameLength, `Client name must be at least ${minClientNameLength} characters long`),
});

export const touchUpAppointmentSchema = z.object({
	...touchUpAppointmentInputSchema.shape,
	...dbEntrySchema.shape,
	type: z.literal("TouchUp"),
});

// Consultation Appointment Input Schema
export const consultationAppointmentInputSchema = baseAppointmentInputSchema.extend({
    clientName: z.string().min(minClientNameLength, `Client name must be at least ${minClientNameLength} characters long`),
});

export const consultationAppointmentSchema = z.object({
	...consultationAppointmentInputSchema.shape,
	...dbEntrySchema.shape,
	type: z.literal("Consultation"),
});

// Blocker Appointment Input Schema
export const blockerAppointmentInputSchema = baseAppointmentInputSchema.extend({
    clientName: z.string().min(minClientNameLength, `Client name must be at least ${minClientNameLength} characters long`),
});

export const blockerAppointmentSchema = z.object({
	...blockerAppointmentInputSchema.shape,
	...dbEntrySchema.shape,
	type: z.literal("Blocker"),
});

// Combined Schema for creating/updating appointments (with discriminated union)
export const appointmentInputWithTypeSchema = z.discriminatedUnion("appointmentType", [
    newTattooAppointmentInputSchema.extend({ appointmentType: z.literal("NewTattoo") }),
    touchUpAppointmentInputSchema.extend({ appointmentType: z.literal("TouchUp") }),
    consultationAppointmentInputSchema.extend({ appointmentType: z.literal("Consultation") }),
    blockerAppointmentInputSchema.extend({ appointmentType: z.literal("Blocker") }),
]);

// Delivered Types (DTOs)
export type AppointmentParamsDTO = z.infer<typeof appointmentParamsSchema>;

export type NewTattooAppointmentInputDTO = z.infer<typeof newTattooAppointmentInputSchema>;
export type NewTattooAppointmentDTO = z.infer<typeof newTattooAppointmentSchema>;

export type TouchUpAppointmentInputDTO = z.infer<typeof touchUpAppointmentInputSchema>;
export type TouchUpAppointmentDTO = z.infer<typeof touchUpAppointmentSchema>;

export type ConsultationAppointmentInputDTO = z.infer<typeof consultationAppointmentInputSchema>;
export type ConsultationAppointmentDTO = z.infer<typeof consultationAppointmentSchema>;

export type BlockerAppointmentInputDTO = z.infer<typeof blockerAppointmentInputSchema>;
export type BlockerAppointmentDTO = z.infer<typeof blockerAppointmentSchema>;

export type AppointmentInputWithTypeDTO = z.infer<typeof appointmentInputWithTypeSchema>;