
import { ActivityType } from './ActivityType';

export interface ScheduleIntervalData {
  start: number;
  end: number;
  type: ActivityType;
  id: string;
}