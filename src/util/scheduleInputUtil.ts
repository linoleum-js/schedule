import { v4 as uuidv4 } from 'uuid';

import { MovementData, Direction, ScheduleData, ScheduleIntervalData, ActivityType, ActivityTypeEmpty } from '@/models';
import { scheduleLengthInMinutes, stepSizeInMinutes } from '@/constants';
import { last } from 'lodash';

const buildIntervalData = (start: number, end: number, type: ActivityType, id?: string) => {
  return {
    start, end, type, id: id ?? uuidv4()
  };
};

export const pad2 = (value: string): string => {
  // TODO refactor
  return value.length === 2 ? value : `0${value}`;
};

const msInMinute = 60 * 1000;

export const msToHHMM = (timeMs: number): string => {
  const totalMinutes = timeMs / msInMinute;
  const hours: string = String(Math.floor(totalMinutes / 60));
  const minutes: string = String(Math.floor(totalMinutes % 60));
  return `${pad2(hours)}:${pad2(minutes)}`;
};

export const getMovementdata = (x1: number, x0: number, step: number): MovementData => {
  const diff: number = x1 - x0;
  const distance: number = Math.abs(diff);
  const sign: number = Math.sign(diff);
  const distanceInSteps: number = Math.floor(distance / step);
  const direction: Direction = diff > 0 ? Direction.Right : Direction.Left;
  const nextStepDone: number = distance % step;
  const lastX = x1 - sign * nextStepDone;
  const diffInMs = sign * distanceInSteps * stepSizeInMinutes;

  return {
    direction,
    distance
  };
};

export const fillScheduleWithEmpty = (data: ScheduleData): ScheduleData => {
  const { list } = data;
  const newList: ScheduleIntervalData[] = [];

  list.forEach((item: ScheduleIntervalData, index: number) => {
    
    if (index === 0) {
      if (item.start !== 0) {
        newList.push(buildIntervalData(0, item.end, ActivityTypeEmpty));
      }
    } else {
      const prev: ScheduleIntervalData = list[index - 1];
      if (prev && prev.end !== item.start) {
        newList.push(buildIntervalData(prev.end, item.start, ActivityTypeEmpty));
      }
    }
    newList.push(item);
  });

  const lastItem: ScheduleIntervalData = newList[newList.length - 1];
  if (lastItem.end !== scheduleLengthInMinutes) {
    newList.push(buildIntervalData(lastItem.end, scheduleLengthInMinutes, ActivityTypeEmpty));
  }

  return {
    ...data,
    list: newList
  };
};

export const addEmptyBoundaries = (data: ScheduleData): ScheduleData => {
  const { list } = data;
  const newList: ScheduleIntervalData[] = [...list];

  const first = list[0];
  if (first.start !== 0) {
    newList.unshift(buildIntervalData(0, first.start, ActivityTypeEmpty));
  }
  const last = list[list.length - 1];
  if (last.end !== scheduleLengthInMinutes) {
    newList.push(buildIntervalData(last.end, scheduleLengthInMinutes, ActivityTypeEmpty));
  }
  return {
    ...data,
    list: newList
  };
};


export const collapseSameType = (
  list: ScheduleIntervalData[], changedItemId?: string
): ScheduleIntervalData[] => {

  const newList: ScheduleIntervalData[] = [];
  let prevType: ActivityType | null = null;
  list.forEach((item: ScheduleIntervalData) => {
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
  let newList: ScheduleIntervalData[] = [];

  newList = list.map((item: ScheduleIntervalData) => {
    const { start, end, type } = item;
    return buildIntervalData(start, end, type);
  });

  return {
    ...data,
    list: newList
  };
};

export const minutesToPixels = (minute: number, stepSizeInMinutes: number, stepSizeInPixels: number) => {
  return minute / stepSizeInMinutes * stepSizeInPixels;
};

export const roundTo = (value: number, step: number) => {
  return Math.floor(value / step) * step;
};

export const pixelsToMinutes = (pixel: number, stepSizeInMinutes: number, stepSizeInPixels: number) => {
  return pixel / stepSizeInPixels * stepSizeInMinutes;
};