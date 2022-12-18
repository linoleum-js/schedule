import { v4 as uuidv4 } from 'uuid';

import { Direction, ScheduleData, IntervalData, ActivityType, ActivityTypeEmpty } from '@/models';
import { INTERVAL_MIN_WIDTH, SCHEDULE_LENGTH } from '@/constants';

export const buildIntervalData = (start: number, end: number, type: ActivityType, id?: string) => {
  return {
    start, end, type, id: id ?? uuidv4()
  };
};

export const addEmptyIntervals = (data: ScheduleData): ScheduleData => {
  const { list } = data;
  const newList: IntervalData[] = [];

  list.forEach((item: IntervalData, index: number) => {
    if (index === 0) {
      if (item.start !== 0) {
        newList.push(buildIntervalData(0, item.end, ActivityTypeEmpty));
      }
    } else {
      const prev: IntervalData = list[index - 1];
      if (prev !== undefined && prev.end !== item.start) {
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

export const mergeNeighbours = (list: IntervalData[], changedItemId?: string): IntervalData[] => {
  const newList: IntervalData[] = [];
  let prevType: ActivityType | null = null;
  list.forEach((item: IntervalData) => {
    const { type, end, id } = item;
    if (type === prevType) {
      const lastItem = { ...newList.at(-1)! };
      lastItem.end = end;
      if (changedItemId && changedItemId === id) {
        lastItem.id = changedItemId;
      }
      newList[newList.length - 1] = lastItem;
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
    const { start, end, type, id } = item;
    if (id) {
      return { ...item };
    }
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
  return Math.round(value / step) * step;
};

export const getDirection = (diff: number) => diff > 0 ? Direction.Right : Direction.Left;
export const getSignedDistance = (diff: number, direction: Direction) => direction === Direction.Right ? diff : -diff;

export const canCreateInside = (data: IntervalData) => {
  const { start, end } = data;
  return Math.abs(start - end) >= INTERVAL_MIN_WIDTH * 3;
};
