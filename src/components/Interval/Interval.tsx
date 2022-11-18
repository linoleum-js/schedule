
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';

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
  // const { item, onChange } = props;
  // const { list } = item;

  // @ts-ignore
  const item: ScheduleIntervalData[] = useSelector((state: AppState) => state.scheduleLists.present.list.find((item) => item.id === props.item.id));
  // @ts-ignore
  const list: ScheduleIntervalData[] = useSelector((state: AppState) => state.scheduleLists.present.list.find((item) => item.id === props.item.id)?.list);
  console.log('list from store', list);
  const dispatch = useDispatch();
  // const [localList, setLocalList] = useState<ScheduleIntervalData[]>([{
  //     start: 420,
  //     end: 720,
  //     type: '2',
  //     id: '444'
  //   }
  // ]);

  const tmpRef = useRef<any>(null)

  // useEffect(() => {
  //   // console.log('setLocalList before useEffect', list);
  //   setLocalList(list);
  // }, []);

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

    // dispatch(updateSchedule({ ...item, list: newList }));
    // onChange({ ...item, list: newList });
    return newList;
  };

  const onMove = (movementData: MovementData, id: string) => {

    // setLocalList((localList: any) => {
    //   const newList = getUpdatedData(movementData, id);
    //   tmpRef.current = newList;

    //   return newList;
    // });
    const newList = getUpdatedData(list, movementData, id);
    // setLocalList(newList);
    dispatch(updateSchedule({ ...item, list: newList }));
  };

  console.log('setLocalList from render', list[0]);

  const onMoveEnd = (data: any, id: any) => {
    console.log('onMoveEnd', list[0]);
    // setLocalList((localList: any): any => {
    //   dispatch(updateSchedule(getNewData()));
    //   return localList;
    // });
    
    // console.log('tmpRef.current', tmpRef.current);
    // dispatch(updateSchedule({ ...item, list: [...localList] }));

    // setTimeout(() => {
    //   dispatch(updateSchedule(getNewData()));
    // }, 200);
  };

  return (
    <div className={styles.Interval}>
      {list.map((item) => {
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
