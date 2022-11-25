
import { generateUsers } from '../../mock-data/intervals';
import { activitiesData } from '../../mock-data/activityTypes';
import { callLoad } from '../../mock-data/callLoad';
import { ScheduleData, ActivityTypeData } from '@/models';
import { CallLoadData } from '@/redux/callLoad/callLoadStore';

// mock api
const Api = {
  getSchedule: (date: string): Promise<ScheduleData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateUsers());
      }, 1);
    });
  },

  getActivities: (): Promise<ActivityTypeData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(activitiesData);
      }, 1);
    });
  },

  getCallLoad: (): Promise<CallLoadData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(callLoad);
      }, 1);
    });
  }
};

export default Api;
