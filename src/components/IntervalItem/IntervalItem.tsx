
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import IntervalItemBody from '../IntervalItemBody/IntervalItemBody';
import { IntervalHandle } from '../IntervalHandle/IntervalHandle';

import { MovementData, IntervalData, ActivityTypeEmpty, Direction } from '@/models';
import { AppState } from '@/redux';
import { INTERVAL_MIN_WIDTH, SCHEDULE_LENGTH, STEP_SIZE_IN_MINUTES } from '@/constants';
import { minutesToPixels, roundTo, getSignedDistance } from '@/util';

import styles from './IntervalItem.module.css';


interface IntervalItemProps {
  onMove: (data: IntervalData) => void;
  onMoveEnd: (data: IntervalData) => void;
  data: IntervalData;
}

// TODO create utility
const getBg = (type: string | number) => {
  return {
    [ActivityTypeEmpty]: 'transparent',
    1: '#ffbc48',
    2: '#48bd54'
  }[type];
};

export const minutesToPixels2 = (minute: number, stepSizeInMinutes: number, stepSizeInPixels: number) => {
  return minute * stepSizeInPixels / stepSizeInMinutes;
};

export const IntervalItem = (props: IntervalItemProps) => {
  const uiState = useSelector((state: AppState) => state.uiState);
  const { stepSizeInPixels, widthInPixels } = uiState;
  const [isInFocus, setIsInFocus] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data } = props;
  const { start, end, type, id } = data;

  const startRounded = roundTo(start, STEP_SIZE_IN_MINUTES);
  const endRounded = roundTo(end, STEP_SIZE_IN_MINUTES);
  
  // TODO useMemo, refactor
  const css = {
    left: roundTo(minutesToPixels(start, STEP_SIZE_IN_MINUTES, stepSizeInPixels), stepSizeInPixels),
    right: roundTo(minutesToPixels(SCHEDULE_LENGTH - end, STEP_SIZE_IN_MINUTES, stepSizeInPixels), stepSizeInPixels),
    backgroundColor: getBg(type)
  };

  const isEmpty = type === ActivityTypeEmpty;

  const onFocus = () => setIsInFocus(true);
  const onBlur = (event: PointerEvent) => {
    if (!ref.current?.contains(event.target as Element)) {
      setIsInFocus(false);
    }
  };

  useEffect(() => {
    document.addEventListener('pointerdown', onBlur);
    return () => {
      document.removeEventListener('pointerdown', onBlur);
    };
  });

  const getNewStart = (diff: number) => {
    let newStart = start + diff;
    newStart = Math.max(newStart, 0);
    newStart = Math.min(newStart, end - INTERVAL_MIN_WIDTH);
    return newStart;
  };

  const getNewEnd = (diff: number) => {
    let newEnd = end + diff;
    newEnd = Math.max(newEnd, start + INTERVAL_MIN_WIDTH);
    newEnd = Math.min(newEnd, SCHEDULE_LENGTH);
    return newEnd;
  };

  // TODO rename to handle*
  const onLeftMove = (movementData: MovementData) => {
    const { distance, direction } = movementData;
    const diff = getSignedDistance(distance, direction);
    props.onMove({ ...data, start: getNewStart(diff) });
  };

  const onRightMove = (movementData: MovementData) => {
    const { distance, direction } = movementData;
    const diff = getSignedDistance(distance, direction);
    props.onMove({ ...data, end: getNewEnd(diff) });
  };

  const onBodyMove = (movementData: MovementData) => {
    const { distance, direction } = movementData;
    const diff = getSignedDistance(distance, direction);
    props.onMove({ ...data, start: getNewStart(diff), end: getNewEnd(diff) });
  };

  const handleMoveEnd = () => {
    props.onMoveEnd({ ...data });
  };

  return (
    <div
      className={styles.IntervalItem}
      style={css}
      onPointerDown={onFocus}
      ref={ref}
    >
      {!isEmpty && isInFocus && (
        <IntervalHandle direction={Direction.Left} onMove={onLeftMove} onMoveEnd={handleMoveEnd} value={startRounded} />
      )}
      {!isEmpty && (
        <IntervalItemBody onMove={onBodyMove} onMoveEnd={handleMoveEnd} />
      )}
      {!isEmpty && isInFocus && (
        <IntervalHandle direction={Direction.Right} onMove={onRightMove} onMoveEnd={handleMoveEnd} value={endRounded} />
      )}
    </div>
  );
};
