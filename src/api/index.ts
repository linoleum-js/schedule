
import { generateUsers } from '../../mock-data/intervals';
import { activitiesData } from '../../mock-data/activityTypes';
import { callLoad } from '../../mock-data/callLoad';
import { ScheduleData, ActivityTypeData } from '@/models';
import { CallLoadData } from '@/redux/callLoad/callLoadStore';

// mock api
const Api = {
  getSchedule: async (date: string): Promise<ScheduleData[]> => {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateUsers());
      }, 1);
    });
  },

  getActivities: async (): Promise<ActivityTypeData[]> => {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(activitiesData);
      }, 1);
    });
  },

  getCallLoad: async (): Promise<CallLoadData[]> => {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(callLoad);
      }, 1);
    });
  }
};

export default Api;
