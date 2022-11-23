import { throttle } from 'lodash';
import { useEffect, useRef, useMemo } from 'react';

import { updateUiState } from '@/redux';
import { STEPS_PER_DAY } from '@/constants';
import { useAppDispatch } from '@/hooks';

import styles from './IntervalGrid.module.css';

const generateHourLabels = () => {
  // TODO const
  const hoursPerDay = 24;
  const res = [];
  for (let i = 0; i < hoursPerDay; i++) {
    res.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return res;
};

// TODO fixed height, scroll, fixed dividers

// TODO rename to something about hours (or just a function?)
export const IntervalGrid = () => {
  const dispatch = useAppDispatch();
  const hourLabels = generateHourLabels();
  const gridWrapper = useRef<HTMLDivElement>(null);

  const calcGridDimensions = () => {
    if (!gridWrapper.current) {
      return;
    }
    const widthInPixels = gridWrapper.current.clientWidth;
    const stepSizeInPixels = widthInPixels / STEPS_PER_DAY;
    dispatch(updateUiState({ widthInPixels, stepSizeInPixels }));
  };


  // TODO throttle?
  const resizeHandler = useMemo(
    () => throttle(calcGridDimensions, 150),
    []
  );
  
  useEffect(() => {
    calcGridDimensions();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <div className={styles.IntervalGrid}>
      <div ref={gridWrapper}>
        {hourLabels.map((item) => {
          return (
            <div key={item} className={styles.IntervalGridColumn}>
              <span>{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
