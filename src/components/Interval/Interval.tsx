
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';

import { IntervalItem } from '../IntervalItem/IntervalItem';
import { Direction, MovementData, ScheduleData, IntervalData } from '@/models';
import { AppState, updateSchedule } from '@/redux';
import { INTERVAL_MIN_WIDTH } from '@/constants';
import { collapseSameType } from '@/util';

import styles from './Interval.module.css';

type IntervalProps = {
  item: ScheduleData,
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
  const index = list.findIndex((item) => item.id === id);
  list[index] = { ...list[index], ...data };
  return list;
};

export const Interval = (props: IntervalProps) => {
  const { item } = props;
  const { list } = item;

  const dispatch = useDispatch();
  const [localList, setLocalList] = useState<IntervalData[]>(list);

  useEffect(() => {
    setLocalList(list);
  }, [list]);

  const getUpdatedData = (currentItem: IntervalData) => {
    const currentItemIndex = localList.findIndex((item) => item.id === currentItem.id);
    let newList: IntervalData[] = [];

    const closesLeftIndex = getClosestLeftIndex(localList, currentItem);
    const closestLeftItem = localList[closesLeftIndex];
    const closestRightIndex = getClosestRightIndex(localList, currentItem);
    const closestRightItem = localList[closestRightIndex];

    newList = [...localList.slice(0, closesLeftIndex + 1), currentItem, ...localList.slice(closestRightIndex)];
    if (closesLeftIndex !== -1) {
      newList = updateItemById(newList, closestLeftItem.id, { end: currentItem.start });
    }
    if (closestRightIndex !== -1) {
      newList = updateItemById(newList, closestRightItem.id, { start: currentItem.end });
    }

    return collapseSameType(newList);
  };

  const updateItemPosition = (currentItem: IntervalData) => {
    const currentItemIndex = localList.findIndex((item) => item.id === currentItem.id);
    let newList: IntervalData[] = [];

    newList = [...localList.slice(0, currentItemIndex), currentItem, ...localList.slice(currentItemIndex)];

    return collapseSameType(newList);
  };

  const onMove = (data: IntervalData) => {
    const newList = updateItemPosition(data);
    setLocalList(newList);
  };;

  const onMoveEnd = (data: IntervalData) => {
    const newList = getUpdatedData(data);
    dispatch(updateSchedule({
      ...item,
      list: newList
    }));
  };

  return (
    <div className={styles.Interval}>
      {localList.map((item) => {
        return (
          <IntervalItem
            onMove={onMove}
            onMoveEnd={onMoveEnd}
            data={item}
            key={item.id}
          />
        );
      })}
    </div>
  );
};
