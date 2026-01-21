import { createContext } from 'react';
import type { DayConfig } from '@/types/api';

export interface CalendarConfig {
  displayStartTime: string;    // e.g., "08:00" (with buffer)
  displayEndTime: string;      // e.g., "18:00" (with buffer)
  workingStartTime: string;    // e.g., "09:00" (actual working hours)
  workingEndTime: string;      // e.g., "17:00" (actual working hours)
  totalBlocks: number;         // e.g., 40 blocks (10 hours × 4)
  blockDuration: number;       // Always 15 (minutes)
  workdays: DayConfig[];
}

export interface CalendarConfigContextType {
  config: CalendarConfig | null;
  isLoading: boolean;
}

const CalendarConfigContext = createContext<CalendarConfigContextType | null>(null);

export { CalendarConfigContext };
