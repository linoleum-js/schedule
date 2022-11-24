
import { useEffect } from 'react';

import { IntervalHours } from '@/components/IntervalHours/IntervalHours';
import { Interval } from '@/components/Interval/Interval';
import { IntervalTableGrid } from '@/components/IntervalTableGrid/IntervalTableGrid';
import { AppState } from '@/redux/store';
import { ScheduleData } from '@/models';
import { fetchScheduleAction, undoUpdateSchedule, redoUpdateSchedule } from '@/redux/scheduleLists/scheduleListsStore';
import { useAppDispatch, useAppSelector } from '@/hooks';

import styles from './IntervalTable.module.css';


export const IntervalTable = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: AppState) => state.scheduleLists.present);
  const { list } = data;

  useEffect(() => {
    dispatch(fetchScheduleAction());
  }, []);

  const undoRedoHandler = (event: KeyboardEvent) => {
    const { key, ctrlKey, metaKey, shiftKey } = event;
    if (key.toLowerCase() === 'z') {
      if (ctrlKey || metaKey) {
        if (shiftKey) {
          dispatch(redoUpdateSchedule());
        } else {
          dispatch(undoUpdateSchedule());
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', undoRedoHandler, false);
    return () => {
      document.removeEventListener('keydown', undoRedoHandler, false);
    };
  });

  // TODO create grid
  return (
    <div className={styles.intervalTableWrapper}>
      <div className={styles.intervalTableDividerLeft}>
        <span>27.05</span>
      </div>
      <div className={styles.intervalTableDividerRight}>
        <span>28.05</span>
      </div>
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