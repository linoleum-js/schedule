
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import moment from 'moment';

import { IntervalHours } from '@/components/IntervalHours/IntervalHours';
import { Interval } from '@/components/Interval/Interval';
import { IntervalTableGrid } from '@/components/IntervalTableGrid/IntervalTableGrid';
import { IntervalDateNavigation } from '@/components/IntervalDateNavigation/IntervalDateNavigation';
import { IntervalTableChart } from '@/components/IntervalTableChart/IntervalTableChart';
import { AppState } from '@/redux/store';
import { ScheduleData } from '@/models';
import {
  fetchScheduleAction, undoUpdateSchedule, redoUpdateSchedule, fetchActivitiesAction, fetchCallLoadAction
} from '@/redux';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { formatDateDisplay } from '@/util';

import styles from './IntervalTable.module.css';

export const IntervalTable = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: AppState) => state.scheduleLists.present);
  const [searchParams] = useSearchParams();
  const { list } = data;

  const dateString = searchParams.get('date') ?? formatDateDisplay(moment(Date.now()));

  useEffect(() => {
    dispatch(fetchScheduleAction(dateString));
    dispatch(fetchCallLoadAction(dateString));
  }, [dateString]);

  useEffect(() => {
    dispatch(fetchActivitiesAction());
  }, []);

  const undoRedoHandler = (event: KeyboardEvent) => {
    const { key, ctrlKey, metaKey, shiftKey } = event;
    const zPressed = key.toLowerCase() === 'z';
    const ctrlPressed = ctrlKey || metaKey;
    if (zPressed && ctrlPressed) {
      if (shiftKey) {
        dispatch(redoUpdateSchedule());
      } else {
        dispatch(undoUpdateSchedule());
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', undoRedoHandler, false);
    return () => {
      document.removeEventListener('keydown', undoRedoHandler, false);
    };
  });

  return (
    <div className={styles.intervalTableWrapper}>
      <IntervalDateNavigation />
      <div className={styles.intervalTable}>
        <IntervalTableChart />
        <div className={styles.intervalHeaderNote}>
          You can:
          <ul>
            <li>create</li>
            <li>remove</li>
            <li>resize</li>
            <li>drag and drop items;</li>
            <li>change item&apos;s type</li>
            <li>navigate between dates</li>
          </ul>
        </div>
        <div className={styles.intervalHeaderWrapper}>

          <div className={styles.intervalTableNameHeader}>
            Full name
          </div>
          <IntervalHours />
        </div>

        <div className={styles.intervalTableBody}>
          <IntervalTableGrid />
          {list.map((item: ScheduleData) => {
            return (
              <div className={styles.intervalTableRow} key={item.id}>
                <div className={styles.intervalTableName} title={item.userName}>
                  {item.userName}
                </div>
                <div className={styles.intervalTableRight}>
                  <Interval data={item} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
