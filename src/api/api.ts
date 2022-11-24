
import { scheduleData } from '../../mock-data/intervals';
import { activitiesData } from '../../mock-data/activityTypes';
import { ScheduleData } from '@/models';

const Api = {
  getSchedule: (): Promise<ScheduleData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(scheduleData);
      }, 1000);
    });
  },

  getActivities: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(activitiesData);
      }, 1000);
    });
  }
};

export default Api;
