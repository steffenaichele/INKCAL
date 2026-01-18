// ============================================================================
// User Types
// ============================================================================

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
}

// ============================================================================
// Contact Types (Discriminated Union)
// ============================================================================

export type ContactType = "Instagram" | "WhatsApp" | "EMail";

export interface InstagramContact {
  contactType: "Instagram";
  contactValue: string;
}

export interface WhatsAppContact {
  contactType: "WhatsApp";
  contactValue: string; // E.164 format with country code
}

export interface EmailContact {
  contactType: "EMail";
  contactValue: string;
}

export type Contact = InstagramContact | WhatsAppContact | EmailContact;

// ============================================================================
// Appointment Types (Discriminated Union)
// ============================================================================

export type AppointmentType = "NewTattoo" | "TouchUp" | "Consultation" | "Blocker";

export interface BaseAppointment {
  _id: string;
  userId: string;
  date: string; // ISO date string
  title: string;
  startTime: string; // ISO time string
  endTime: string; // ISO time string
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NewTattooAppointment extends BaseAppointment {
  appointmentType: "NewTattoo";
  clientName: string;
  designDescription: string;
  placement?: string;
  size?: string;
  color?: boolean;
  contact: Contact;
}

export interface TouchUpAppointment extends BaseAppointment {
  appointmentType: "TouchUp";
  clientName: string;
  contact: Contact;
}

export interface ConsultationAppointment extends BaseAppointment {
  appointmentType: "Consultation";
  clientName: string;
  contact: Contact;
}

export interface BlockerAppointment extends BaseAppointment {
  appointmentType: "Blocker";
  clientName: string;
}

export type Appointment =
  | NewTattooAppointment
  | TouchUpAppointment
  | ConsultationAppointment
  | BlockerAppointment;

// ============================================================================
// Appointment Input Types (for POST/PUT requests)
// ============================================================================

export interface BaseAppointmentInput {
  userId: string;
  date: string;
  title: string;
  startTime: string;
  endTime: string;
}

export interface NewTattooAppointmentInput extends BaseAppointmentInput {
  appointmentType: "NewTattoo";
  clientName: string;
  designDescription: string;
  placement?: string;
  size?: string;
  color?: boolean;
  contact: Contact;
}

export interface TouchUpAppointmentInput extends BaseAppointmentInput {
  appointmentType: "TouchUp";
  clientName: string;
  contact: Contact;
}

export interface ConsultationAppointmentInput extends BaseAppointmentInput {
  appointmentType: "Consultation";
  clientName: string;
  contact: Contact;
}

export interface BlockerAppointmentInput extends BaseAppointmentInput {
  appointmentType: "Blocker";
  clientName: string;
}

export type AppointmentInput =
  | NewTattooAppointmentInput
  | TouchUpAppointmentInput
  | ConsultationAppointmentInput
  | BlockerAppointmentInput;

// ============================================================================
// Type Guards for Discriminated Unions
// ============================================================================

// Contact Type Guards
export function isInstagramContact(contact: Contact): contact is InstagramContact {
  return contact.contactType === "Instagram";
}

export function isWhatsAppContact(contact: Contact): contact is WhatsAppContact {
  return contact.contactType === "WhatsApp";
}

export function isEmailContact(contact: Contact): contact is EmailContact {
  return contact.contactType === "EMail";
}

// Appointment Type Guards
export function isNewTattooAppointment(
  appointment: Appointment
): appointment is NewTattooAppointment {
  return appointment.appointmentType === "NewTattoo";
}

export function isTouchUpAppointment(
  appointment: Appointment
): appointment is TouchUpAppointment {
  return appointment.appointmentType === "TouchUp";
}

export function isConsultationAppointment(
  appointment: Appointment
): appointment is ConsultationAppointment {
  return appointment.appointmentType === "Consultation";
}

export function isBlockerAppointment(
  appointment: Appointment
): appointment is BlockerAppointment {
  return appointment.appointmentType === "Blocker";
}

// ============================================================================
// API Error Type
// ============================================================================

export interface ApiError {
  message: string;
  status?: number;
}

// ============================================================================
// Auth Types
// ============================================================================

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterFormState {
  name: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  signedIn: boolean;
  user: User | null;
  handleSignIn: (data: LoginData) => Promise<void>;
  handleSignOut: () => Promise<void>;
  handleRegister: (formState: RegisterFormState) => Promise<void>;
}
