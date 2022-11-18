
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import IntervalItemBody from '../IntervalItemBody/IntervalItemBody';
import { IntervalHandle } from '../IntervalHandle/IntervalHandle';

import { MovementData, ScheduleIntervalData, ActivityTypeEmpty, Direction } from '@/models';
import { AppState } from '@/redux';
import { stepSizeInMinutes } from '@/constants';
import { minutesToPixels } from '@/util';

import styles from './IntervalItem.module.css';

/**
 * 
 */


interface IntervalItemProps {
  onMove: (movementData: MovementData) => void;
  data: ScheduleIntervalData;
}

// TODO create utility
const getBg = (type: string | number) => {
  return {
    [ActivityTypeEmpty]: 'transparent',
    1: '#ffbc48',
    2: '#48bd54'
  }[type];
};

export const IntervalItem = (props: IntervalItemProps) => {
  const uiState = useSelector((state: AppState) => state.uiState);
  const [isInFocus, setIsInFocus] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {

    document.addEventListener('mousemove', () => {

    });
  });
  
  // TODO refactor
  const css = {
    left: minutesToPixels(props.data.start, stepSizeInMinutes, uiState.stepSizeInPixels),
    width: minutesToPixels(props.data.end - props.data.start, stepSizeInMinutes, uiState.stepSizeInPixels),
    backgroundColor: getBg(props.data.type)
  };

  const isEmpty = props.data.type === ActivityTypeEmpty;

  const onFocus = () => setIsInFocus(true);
  const onBlur = (event: PointerEvent) => {
    // @ts-ignore
    if (!ref.current?.contains(event.target)) {
      setIsInFocus(false);
    }
  };

  useEffect(() => {
    document.addEventListener('pointerdown', onBlur);
    return () => {
      document.removeEventListener('pointerdown', onBlur);
    };
  });

  const onLeftMove = () => {};

  const onLeftMoveEnd = () => {};

  const onRightMove = () => {};

  const onRightMoveEnd = () => {};


  const onBodyMove = (data: any) => {
    console.log('onBodyMove', data);
  };

  const onBodyMoveEnd = () => {};

  return (
    <div
      className={styles.IntervalItem}
      style={css} onPointerDown={onFocus}
      ref={ref}
    >
      {!isEmpty && isInFocus && <IntervalHandle direction={Direction.Left} onMove={onLeftMove} onMoveEnd={onLeftMoveEnd} />}
      <IntervalItemBody
        onMove={onBodyMove}
        onMoveEnd={onBodyMoveEnd}
      />
      {!isEmpty && isInFocus && <IntervalHandle direction={Direction.Right} onMove={onRightMove} onMoveEnd={onRightMoveEnd} />}
    </div>
  );
};
