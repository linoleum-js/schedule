import { throttle } from 'lodash';
import { useEffect, useRef, useMemo } from 'react';

import { updateUiState } from '@/redux';
import { STEPS_PER_DAY } from '@/constants';
import { useAppDispatch } from '@/hooks';

import styles from './IntervalHours.module.css';

const generateHourLabels = () => {
  // TODO const
  const hoursPerDay = 24;
  const res = [];
  for (let i = 0; i < hoursPerDay; i++) {
    res.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return res;
};

export const IntervalHours = () => {
  const dispatch = useAppDispatch();
  const hourLabels = generateHourLabels();
  const gridWrapper = useRef<HTMLDivElement>(null);

  const calcHoursDimensions = () => {
    if (!gridWrapper.current) {
      return;
    }
    const widthInPixels = gridWrapper.current.clientWidth;
    const stepSizeInPixels = widthInPixels / STEPS_PER_DAY;
    dispatch(updateUiState({ widthInPixels, stepSizeInPixels }));
  };


  // TODO throttle?
  const resizeHandler = useMemo(
    () => throttle(calcHoursDimensions, 150),
    []
  );
  
  useEffect(() => {
    calcHoursDimensions();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <div className={styles.intervalHours}>
      <div ref={gridWrapper}>
        {hourLabels.map((item) => {
          return (
            <div key={item} className={styles.intervalHoursColumn}>
              <span>{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
