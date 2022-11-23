
import { useEffect } from 'react';

import { IntervalHours } from '@/components/IntervalHours/IntervalHours';
import { Interval } from '@/components/Interval/Interval';
import { IntervalTableGrid } from '@/components/IntervalTableGrid/IntervalTableGrid';
import { AppState } from '@/redux/store';
import { ScheduleData } from '@/models';
import { fetchScheduleList } from '@/redux/scheduleLists/scheduleListsStore';
import { useAppDispatch, useAppSelector } from '@/hooks';

import styles from './IntervalTable.module.css';


export const IntervalTable = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: AppState) => state.scheduleLists.present);
  const { list } = data;
  const uiState = useAppSelector((state: AppState) => state.uiState);

  useEffect(() => {
    dispatch(fetchScheduleList());
  }, []);

  const onChange = (schedule: ScheduleData) => {
    const scheduleIndex = list.findIndex((item) => item.id === schedule.id);
  };

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
                  <Interval
                    data={item}
                    onChange={onChange}
                  />
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};