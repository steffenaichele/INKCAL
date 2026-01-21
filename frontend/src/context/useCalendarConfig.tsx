import { use } from 'react';
import { CalendarConfigContext, type CalendarConfigContextType } from './CalendarConfigContext';

export const useCalendarConfig = (): CalendarConfigContextType => {
  const context = use(CalendarConfigContext);
  if (!context) {
    throw new Error('useCalendarConfig must be used within a CalendarConfigProvider');
  }
  return context;
};
