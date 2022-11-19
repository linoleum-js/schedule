import { v4 as uuidv4 } from 'uuid';

import { MovementData, Direction, ScheduleData, IntervalData, ActivityType, ActivityTypeEmpty } from '@/models';
import { SCHEDULE_LENGTH, STEP_SIZE_IN_MINUTES } from '@/constants';
import { last } from 'lodash';

const buildIntervalData = (start: number, end: number, type: ActivityType, id?: string) => {
  return {
    start, end, type, id: id ?? uuidv4()
  };
};

export const pad2 = (value: string): string =>  value.padStart(2, '0');

const msInMinute = 60 * 1000;

export const mmToHHMM = (timeMinutes: number): string => {
  const hours: string = String(Math.floor(timeMinutes / 60));
  const minutes: string = String(Math.floor(timeMinutes % 60));
  return `${pad2(hours)}:${pad2(minutes)}`;
};

export const fillScheduleWithEmpty = (data: ScheduleData): ScheduleData => {
  const { list } = data;
  const newList: IntervalData[] = [];

  list.forEach((item: IntervalData, index: number) => {
    
    if (index === 0) {
      if (item.start !== 0) {
        newList.push(buildIntervalData(0, item.end, ActivityTypeEmpty));
      }
    } else {
      const prev: IntervalData = list[index - 1];
      if (prev && prev.end !== item.start) {
        newList.push(buildIntervalData(prev.end, item.start, ActivityTypeEmpty));
      }
    }
    newList.push(item);
  });

  const lastItem: IntervalData = newList[newList.length - 1];
  if (lastItem.end !== SCHEDULE_LENGTH) {
    newList.push(buildIntervalData(lastItem.end, SCHEDULE_LENGTH, ActivityTypeEmpty));
  }

  return {
    ...data,
    list: newList
  };
};

export const addEmptyBoundaries = (data: ScheduleData): ScheduleData => {
  const { list } = data;
  const newList: IntervalData[] = [...list];

  const first = list[0];
  if (first.start !== 0) {
    newList.unshift(buildIntervalData(0, first.start, ActivityTypeEmpty));
  }
  const last = list[list.length - 1];
  if (last.end !== SCHEDULE_LENGTH) {
    newList.push(buildIntervalData(last.end, SCHEDULE_LENGTH, ActivityTypeEmpty));
  }
  return {
    ...data,
    list: newList
  };
};


export const collapseSameType = (
  list: IntervalData[], changedItemId?: string
): IntervalData[] => {

  const newList: IntervalData[] = [];
  let prevType: ActivityType | null = null;
  list.forEach((item: IntervalData) => {
    const { type, end, id } = item;
    if (type === prevType) {
      const lastItem = last(newList)!;
      lastItem.end = end;
      if (changedItemId && changedItemId === id) {
        lastItem.id = changedItemId;
      }
    } else {
      newList.push(item);
      prevType = type;
    }
  });
  return newList;
};

export const generateIds = (data: ScheduleData): ScheduleData => {
  const { list } = data;
  let newList: IntervalData[] = [];

  newList = list.map((item: IntervalData) => {
    const { start, end, type } = item;
    return buildIntervalData(start, end, type);
  });

  return {
    ...data,
    list: newList
  };
};

export const minutesToPixels = (minute: number, stepSizeInMinutes: number, stepSizeInPixels: number) => {
  return minute * stepSizeInPixels / stepSizeInMinutes;
};

export const pixelsToMinutes = (pixel: number, stepSizeInMinutes: number, stepSizeInPixels: number) => {
  return pixel / stepSizeInPixels * stepSizeInMinutes;
};

export const roundTo = (value: number, step: number) => {
  return Math.floor(value / step) * step;
};


export const getDirection = (diff: number) => diff > 0 ? Direction.Right : Direction.Left;
export const getSignedDistance = (diff: number, direction: Direction) => direction === Direction.Right ? diff : -diff;
