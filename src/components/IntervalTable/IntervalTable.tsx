
import { useEffect } from 'react';
import clsx from 'clsx';

import { IntervalGrid } from '@/components/IntervalGrid/IntervalGrid';
import { Interval } from '@/components/Interval/Interval';
import { AppState } from '@/redux/store';
import { ScheduleData } from '@/models';
import { fetchScheduleList } from '@/redux/scheduleLists/scheduleListsStore';
import { useAppDispatch, useAppSelector } from '@/hooks';

import styles from './IntervalTable.module.css';

const generateGridLabels = () => {
  return new Array(24).fill(1);
};

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
    <div className={styles.IntervalTableWrapper}>
      <div className={styles.IntervalTableDividerLeft}>
        <span>27.05</span>
      </div>
      <div className={styles.IntervalTableDividerRight}>
        <span>28.05</span>
      </div>
      <div className={styles.IntervalTable}>

        <div className={styles.IntervalChartWrapper}>
          chart
        </div>
        <div className={styles.IntervalHeaderWrapper}>
          <div className={styles.IntervalTableNameHeader}>
            Full name
          </div>
          <IntervalGrid />
        </div>

        <div className={styles.IntervalTableBody}>
          <div style={{ display: 'flex', position: 'absolute', width: '100%', height: '100%', paddingLeft: '220px', justifyContent: 'space-between', marginLeft: '1px' }}>
            {generateGridLabels().map((item, index) => {
              return (
                <div key={index} style={{ borderRight: '1px solid var(--light-grey)', height: '100%', flexGrow: 1 }} />
              );
            })}
          </div>
          {list.map((item: ScheduleData) => {
            return (
              <div className={styles.IntervalTableRow} key={item.id}>
                <div className={styles.IntervalTableName} title={item.userName}>{item.userName}</div>
                <div className={styles.IntervalTableRight}>
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