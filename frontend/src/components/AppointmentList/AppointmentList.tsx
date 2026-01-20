import type { Appointment } from '@/types/api';
import './AppointmentList.scss';

export interface AppointmentListProps {
  appointments: Appointment[];
  isLoading: boolean;
  error: Error | null;
}

const AppointmentList = ({ appointments, isLoading, error }: AppointmentListProps) => {
  if (isLoading) {
    return (
      <div className="appointment-list">
        <h2 className="appointment-list__title">Your Appointments</h2>
        <p className="appointment-list__loading">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appointment-list">
        <h2 className="appointment-list__title">Your Appointments</h2>
        <div className="appointment-list__error">
          Error loading appointments: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="appointment-list">
        <h2 className="appointment-list__title">Your Appointments</h2>
        <p className="appointment-list__empty">
          No appointments found. Create your first appointment!
        </p>
      </div>
    );
  }

  return (
    <div className="appointment-list">
      <h2 className="appointment-list__title">Your Appointments</h2>

      <div className="appointment-list__grid">
        {appointments.map((appointment: Appointment) => (
          <div key={appointment._id} className="appointment-list__card">
            <div className="appointment-list__card-content">
              <div>
                <h3 className="appointment-list__card-title">{appointment.title}</h3>
                <div className="appointment-list__card-details">
                  <p>
                    <strong>Type:</strong> {appointment.appointmentType}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {appointment.startTime} - {appointment.endTime}
                  </p>
                  {appointment.appointmentType !== "Blocker" && (
                    <p>
                      <strong>Client:</strong> {appointment.clientName}
                    </p>
                  )}
                </div>
              </div>
              <span className={`appointment-list__badge appointment-list__badge--${appointment.appointmentType.toLowerCase()}`}>
                {appointment.appointmentType}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentList;
