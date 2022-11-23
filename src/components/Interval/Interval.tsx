
import { useEffect, useState } from 'react';

import { IntervalItem } from '../IntervalItem/IntervalItem';
import { ScheduleData, IntervalData, ActivityType, ActivityTypeEmpty } from '@/models';
import { ActivityTypeData, AppState, updateSchedule } from '@/redux';
import { INTERVAL_MIN_WIDTH, STEP_SIZE_IN_MINUTES } from '@/constants';
import { buildIntervalData, mergeNeighbours, roundTo } from '@/util';

import styles from './Interval.module.css';
import { useAppDispatch, useAppSelector } from '@/hooks';

type IntervalProps = {
  data: ScheduleData,
  onChange: (data: ScheduleData) => void;
};

/**
 * find closest item to the left that starts before the current item's new start position
 */
const getClosestLeftIndex = (list: IntervalData[], currentItem: IntervalData) => {
  const currentItemIndex = list.findIndex((item) => item.id === currentItem.id);
  let closesLeftIndex = -1;
  for (let i = currentItemIndex - 1; i >= 0; i--) {
    const item = list[i];
    if (item.start + INTERVAL_MIN_WIDTH <= currentItem.start) {
      closesLeftIndex = i;
      break;
    }
  }
  return closesLeftIndex;
};

/**
 * find closest item to the right that ends after the current item's new end position
 */
const getClosestRightIndex = (list: IntervalData[], currentItem: IntervalData) => {
  const currentItemIndex = list.findIndex((item) => item.id === currentItem.id);
  let closesRightIndex = -1;
  for (let i = currentItemIndex + 1; i < list.length; i++) {
    const item = list[i];
    if (item.end - INTERVAL_MIN_WIDTH >= currentItem.end) {
      closesRightIndex = i;
      break;
    }
  }
  return closesRightIndex;
};

// TODO util
const updateItemById = (list: any[], id: any, data: any) => {
  const newList = [...list]
  const index = newList.findIndex((item) => item.id === id);
  newList[index] = { ...newList[index], ...data };
  return newList;
};

const getIndexById = (list: IntervalData[], id: string) => {
  return list.findIndex((item) => item.id === id);
};

const roundItems = (list: IntervalData[]) => {
  return [...list.map((item) => ({
    ...item,
    start: roundTo(item.start, STEP_SIZE_IN_MINUTES),
    end: roundTo(item.end, STEP_SIZE_IN_MINUTES)
  }))];
};

const getOtherActivityType = (list: ActivityTypeData[], type: ActivityType) => {
  return list.filter((item) => item.name !== type)[0].name;
};

export const Interval = (props: IntervalProps) => {
  const { data } = props;
  const { list } = data;

  const dispatch = useAppDispatch();
  const activityTypes = useAppSelector((state: AppState) => state.activityTypes.list);
  const [localList, setLocalList] = useState<IntervalData[]>(list);

  useEffect(() => {
    setLocalList(list);
  }, [list]);

  const getUpdatedData = (currentItem: IntervalData) => {
    let newList: IntervalData[] = [];

    const closesLeftIndex = getClosestLeftIndex(localList, currentItem);
    const closestLeftItem = localList[closesLeftIndex];
    const closestRightIndex = getClosestRightIndex(localList, currentItem);
    const closestRightItem = localList[closestRightIndex];

    newList = [
      ...localList.slice(0, closesLeftIndex + 1),
      currentItem,
      ...localList.slice(closestRightIndex)
    ];
    if (closesLeftIndex !== -1) {
      newList = updateItemById(newList, closestLeftItem.id, { end: currentItem.start });
    }
    if (closestRightIndex !== -1) {
      newList = updateItemById(newList, closestRightItem.id, { start: currentItem.end });
    }

    return mergeNeighbours(newList, currentItem.id);
  };

  const onMove = (currentItem: IntervalData) => {
    const newList = getUpdatedData(currentItem);
    setLocalList(newList);
  };;

  const onMoveEnd = (currentItem: IntervalData) => {
    const newList = getUpdatedData(currentItem);
    dispatch(updateSchedule({
      ...data,
      list: [...roundItems(newList)]
    }));
  };

  const handleTypeChange = (id: string, type: ActivityType) => {
    const index = getIndexById(localList, id);
    const item = localList[index];
    const newList = [
      ...localList.slice(0, index),
      { ...item, type },
      ...localList.slice(index + 1)
    ];
    dispatch(updateSchedule({ ...data, list: newList }));
  };

  const handleCreate = (id: string) => {
    const index = getIndexById(localList, id);
    const item = localList[index];

    const itemWidth = item.end - item.start;
    const boundaryLeft = roundTo(item.start + itemWidth / 3, STEP_SIZE_IN_MINUTES);
    const boundaryRight = roundTo(item.start + itemWidth * 2 / 3, STEP_SIZE_IN_MINUTES);

    const leftItem = buildIntervalData(item.start, boundaryLeft, item.type);
    const newItemYype = getOtherActivityType(activityTypes, item.type);
    const newItem = buildIntervalData(boundaryLeft, boundaryRight, newItemYype);
    const rightItem = buildIntervalData(boundaryRight, item.end, item.type);
    
    const newList = [
      ...localList.slice(0, index),
      leftItem,
      newItem,
      rightItem,
      ...localList.slice(index + 1)
    ];
    dispatch(updateSchedule({ ...data, list: newList }));
  };

  const handleRemove = (id: string) => {
    const index = getIndexById(localList, id);
    const item = localList[index];
    const newList = mergeNeighbours([
      ...localList.slice(0, index),
      { ...item, type: ActivityTypeEmpty },
      ...localList.slice(index + 1)
    ]);
    dispatch(updateSchedule({ ...data, list: newList }));
  };

  return (
    <div className={styles.interval}>
      {localList.map((item) => {
        return (
          <IntervalItem
            onMove={onMove}
            onMoveEnd={onMoveEnd}
            onTypeChange={handleTypeChange}
            onCreate={handleCreate}
            onRemove={handleRemove}
            data={item}
            key={item.id}
          />
        );
      })}
    </div>
  );
};
