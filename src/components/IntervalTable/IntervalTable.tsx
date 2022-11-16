
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import { IntervalGrid } from './IntervalGrid/IntervalGrid';
import { Interval } from '@/components/Interval/Interval';
import { AppState } from '@/redux/store';
import { ScheduleData } from '@/models';
import { fetchScheduleList } from '@/redux/scheduleLists/scheduleListsStore'; 

import styles from './IntervalTable.module.css';
import { useEffect } from 'react';


const users = [{
  username: 'Some name 123',
  id: '1'
}, {
  username: 'Some name 123',
  id: '2'
}, {
  username: 'Some name 123',
  id: '3'
}, {
  username: 'Some name 123',
  id: '4'
}, {
  username: 'Some name 123',
  id: '5'
}, {
  username: 'Some name 123',
  id: '6'
}, {
  username: 'Some name 123',
  id: '7'
}, {
  username: 'Some name 123',
  id: '8'
}, {
  username: 'Some name 123',
  id: '9'
}, ];

const generateGridLabels = () => {
  return new Array(24).fill(1);
};

export const IntervalTable = () => {

  const dispatch = useDispatch();
  const data = useSelector((state: AppState) => state.scheduleLists.present);
  const uiState = useSelector((state: AppState) => state.uiState);

  useEffect(() => {
    dispatch(fetchScheduleList());
  }, []);

  return (
    <div className={styles.IntervalTableWrapper}>
      <div className={styles.IntervalTableDividerLeft}>
        <span>27.05</span>
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
          <div style={{ display: 'flex', position: 'absolute', width: '100%', height: '100%', paddingLeft: '235px', paddingRight: '35px', justifyContent: 'space-between', marginLeft: '1px' }}>
            {generateGridLabels().map((item, index) => {
              return (
                <div key={index} style={{ borderRight: '1px solid var(--light-grey)', height: '100%', flexGrow: 1 }} />
              );
            })}
          </div>
          {data.list.map((item: ScheduleData) => {
            return (
              <div className={styles.IntervalTableRow} key={item.id}>
                <div className={styles.IntervalTableName}>{item.userName}</div>
                <div className={styles.IntervalTableRight}>
                  <Interval data={item.list} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.IntervalTableDividerRight}>
        <span>28.05</span>
      </div>
    </div>
  );
};