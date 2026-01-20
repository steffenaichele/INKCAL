import type { Appointment } from '@/types/api';
import { getAppointmentTypeColor } from '@/utils/calendar';
import './AppointmentCard.scss';

export interface AppointmentCardProps {
  appointment: Appointment;
  style?: React.CSSProperties;
  onClick?: (appointment: Appointment) => void;
}

const AppointmentCard = ({ appointment, style, onClick }: AppointmentCardProps) => {
  const backgroundColor = getAppointmentTypeColor(appointment.appointmentType);

  const handleClick = () => {
    onClick?.(appointment);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(appointment);
    }
  };

  // Format time range
  const timeRange = `${appointment.startTime} - ${appointment.endTime}`;

  // Show client name for non-Blocker appointments
  const showClient = appointment.appointmentType !== 'Blocker';
  const clientName = showClient ? appointment.clientName : null;

  return (
    <div
      className="appointment-card"
      style={{ ...style, backgroundColor }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      title={`${appointment.title} - ${timeRange}${clientName ? ` - ${clientName}` : ''}`}
    >
      <div className="appointment-card__header">
        <span className="appointment-card__type">{appointment.appointmentType}</span>
        <span className="appointment-card__time">{timeRange}</span>
      </div>

      <div className="appointment-card__title">{appointment.title}</div>

      {clientName && (
        <div className="appointment-card__client">{clientName}</div>
      )}
    </div>
  );
};

export default AppointmentCard;
