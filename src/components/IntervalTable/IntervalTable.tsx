
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import moment from 'moment';

import { IntervalHours } from '@/components/IntervalHours/IntervalHours';
import { Interval } from '@/components/Interval/Interval';
import { IntervalTableGrid } from '@/components/IntervalTableGrid/IntervalTableGrid';
import { IntervalDateNavigation } from '@/components/IntervalDateNavigation/IntervalDateNavigation';
import { AppState } from '@/redux/store';
import { ScheduleData } from '@/models';
import { fetchScheduleAction, undoUpdateSchedule, redoUpdateSchedule, fetchActivitiesAction } from '@/redux';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { formatDateDisplay, formatDate, parseDate } from '@/util';

import styles from './IntervalTable.module.css';

export const IntervalTable = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: AppState) => state.scheduleLists.present);
  let [searchParams] = useSearchParams();
  const { list } = data;

  const dateString = searchParams.get('date') ?? formatDateDisplay(moment(Date.now()));
  const date = parseDate(dateString);

  useEffect(() => {
    dispatch(fetchScheduleAction(formatDate(date)));
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

        <div className={styles.intervalChartWrapper}>
          chart
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
                <div className={styles.intervalTableName} title={item.userName}>{item.userName}</div>
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
