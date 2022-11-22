
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { clamp } from 'lodash';

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

export const IntervalItem = (props: IntervalItemProps) => {
  const uiState = useSelector((state: AppState) => state.uiState);
  const { stepSizeInPixels } = uiState;
  const [isInFocus, setIsInFocus] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data } = props;
  const { start, end, type, id } = data;

  const startRounded = roundTo(start, STEP_SIZE_IN_MINUTES);
  const endRounded = roundTo(end, STEP_SIZE_IN_MINUTES);
  

  // TODO useMemo, refactor
  const left = roundTo(minutesToPixels(start, STEP_SIZE_IN_MINUTES, stepSizeInPixels), stepSizeInPixels);
  const right = roundTo(minutesToPixels(SCHEDULE_LENGTH - end, STEP_SIZE_IN_MINUTES, stepSizeInPixels), stepSizeInPixels);

  const css = {
    left,
    right,
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
  
  const clampStart = (diff: number) => clamp(start + diff, 0, end - INTERVAL_MIN_WIDTH);
  const clampEnd = (diff: number) => clamp(end + diff, start + INTERVAL_MIN_WIDTH, SCHEDULE_LENGTH);

  // TODO rename to handle*
  const onLeftMove = (movementData: MovementData) => {
    const { distance, direction } = movementData;
    const diff = getSignedDistance(distance, direction);
    props.onMove({ ...data, start: clampStart(diff) });
  };

  const onRightMove = (movementData: MovementData) => {
    const { distance, direction } = movementData;
    const diff = getSignedDistance(distance, direction);
    props.onMove({ ...data, end: clampEnd(diff) });
  };

  const onBodyMove = (movementData: MovementData) => {
    const { distance, direction } = movementData;
    const diff = getSignedDistance(distance, direction);
    let newStart;
    let newEnd;
    if (direction === Direction.Left) {
      // We need to use the new value for start, otherwise (when moving to the left)
      // in cases when the diff value is bigger than the current interval's width,
      // the new end value may end up further to the left than the original left value.
      newStart = clampStart(diff);
      newEnd = clamp(end + diff, newStart + INTERVAL_MIN_WIDTH, SCHEDULE_LENGTH);
    } else {
      // The same applies to moving to the right, except that we need to
      // update the right end first so the "new" space is available for the left end
      newEnd = clampEnd(diff);
      newStart = clamp(start + diff, 0, newEnd - INTERVAL_MIN_WIDTH);
    }
    const newElement = { ...data, start: newStart, end: newEnd };
    props.onMove(newElement);
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
