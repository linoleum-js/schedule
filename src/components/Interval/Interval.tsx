
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';

import { isEqual } from 'lodash';

import { IntervalItem } from '../IntervalItem/IntervalItem';
import { Direction, MovementData, ScheduleData, ScheduleIntervalData } from '@/models';
import { AppState, updateSchedule } from '@/redux';
import { scheduleLengthInMinutes } from '@/constants';

import styles from './Interval.module.css';

type IntervalProps = {
  item: ScheduleData,
  onChange: (data: ScheduleData) => void;
};

const INTERVAL_MIN_WIDTH = 15;

export const Interval = (props: IntervalProps) => {
  const { item, onChange } = props;
  const { list } = item;

  const dispatch = useDispatch();
  const [localList, setLocalList] = useState<ScheduleIntervalData[]>(list);

  const tmpRef = useRef<any>(null)

  useEffect(() => {
    setLocalList(list);
  }, [list]);

  const getUpdatedData = (localList: any[], movementData: MovementData, id: string) => {

    const { distance, direction } = movementData;
    const currentItemIndex = localList.findIndex((item) => item.id === id);
    const currentItem = { ...localList[currentItemIndex] };
    const diff = direction === Direction.Left ? -distance : distance;
    let newList: ScheduleIntervalData[] = [];
    if (direction === Direction.Left) {
      currentItem.start += diff;
      // TODO ensure min
      if (currentItem.start < 0) {
        currentItem.start = 0;
      }
      // find closest item to the left that starts before the current item's new start position
      let closesLeftIndex = -1;
      for (let i = 0; i < currentItemIndex; i++) {
        const item = localList[i];
        if (item.start + INTERVAL_MIN_WIDTH <= currentItem.start) {
          closesLeftIndex = i;
          break;
        }
      }

      if (closesLeftIndex === -1) {
        newList = [currentItem, ...localList.slice(currentItemIndex + 1)];
      } else {
        newList = [...localList.slice(0, currentItemIndex), currentItem, ...localList.slice(currentItemIndex + 1)];
      }
    } else {
      currentItem.start += diff;
      // TODO ensure max
      if (currentItem.end > scheduleLengthInMinutes - INTERVAL_MIN_WIDTH) {
        currentItem.end = scheduleLengthInMinutes - INTERVAL_MIN_WIDTH;
      }
      newList = [...localList.slice(0, currentItemIndex), currentItem, ...localList.slice(currentItemIndex + 1)];
    }

    return newList;
  };

  const onMove = (movementData: MovementData, id: string) => {
    const newList = getUpdatedData(localList, movementData, id);
    setLocalList(newList);
  };;

  const onMoveEnd = (data: any, id: any) => {
    dispatch(updateSchedule({
      ...item,
      list: localList
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
