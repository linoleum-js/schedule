
import { useEffect, useState, useRef } from 'react';
import { clamp } from 'lodash';

import IntervalItemBody from '../IntervalItemBody/IntervalItemBody';
import { IntervalHandle } from '../IntervalHandle/IntervalHandle';
import { IntervalMenu } from '../IntervalMenu/IntervalMenu';

import {
  MovementData, IntervalData, ActivityTypeEmpty, Direction, ActivityType, Point, ActivityTypeData
} from '@/models';
import { AppState } from '@/redux';
import { INTERVAL_MIN_WIDTH, SCHEDULE_LENGTH, STEP_SIZE_IN_MINUTES } from '@/constants';
import { minutesToPixels, roundTo, getSignedDistance, canCreateInside } from '@/util';
import { useAppSelector } from '@/hooks';

import styles from './IntervalItem.module.css';

interface IntervalItemProps {
  onMove: (data: IntervalData) => void;
  onMoveEnd: (data: IntervalData) => void;
  onTypeChange: (id: string, type: ActivityType) => void;
  onRemove: (id: string) => void;
  onCreate: (id: string) => void;
  data: IntervalData;
}

const getActivityTypeColor = (acrivityType: ActivityType, list: ActivityTypeData[]) => {
  return list.find((item) => item.name === acrivityType)?.color;
};

export const IntervalItem = (props: IntervalItemProps) => {
  const uiState = useAppSelector((state: AppState) => state.uiState);
  const activityTypes = useAppSelector((state: AppState) => state.activityTypes.list);
  const { stepSizeInPixels } = uiState;
  const [isInFocus, setIsInFocus] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPositionGlobal, setMenuPositionGlobal] = useState<Point>({ x: 0, y: 0 });
  const [menuPositionRelative, setMenuPositionRelative] = useState<Point>({ x: 0, y: 0 });
  const domNode = useRef<HTMLDivElement>(null);

  const { data } = props;
  const { start, end, type, id } = data;

  const startRounded = roundTo(start, STEP_SIZE_IN_MINUTES);
  const endRounded = roundTo(end, STEP_SIZE_IN_MINUTES);

  const left = roundTo(
    minutesToPixels(start, STEP_SIZE_IN_MINUTES, stepSizeInPixels),
    stepSizeInPixels
  );
  const right = roundTo(
    minutesToPixels(SCHEDULE_LENGTH - end, STEP_SIZE_IN_MINUTES, stepSizeInPixels),
    stepSizeInPixels
  );
  const backgroundColor = getActivityTypeColor(type, activityTypes);

  const css = { left, right, backgroundColor };

  const isEmpty = type === ActivityTypeEmpty;

  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.button === 0) {
      setIsInFocus(true);
      setIsMenuOpen(false);
    }
  };

  const handleBlur = (event: PointerEvent) => {
    if (!domNode.current?.contains(event.target as Element)) {
      setIsInFocus(false);
      setIsMenuOpen(false);
    }
  };

  const clampStart = (diff: number) => clamp(start + diff, 0, end - INTERVAL_MIN_WIDTH);
  const clampEnd = (diff: number) => clamp(end + diff, start + INTERVAL_MIN_WIDTH, SCHEDULE_LENGTH);

  const handleLeftMove = (movementData: MovementData) => {
    const { distance, direction } = movementData;
    const diff = getSignedDistance(distance, direction);
    props.onMove({ ...data, start: clampStart(diff) });
  };

  const handleRightMove = (movementData: MovementData) => {
    const { distance, direction } = movementData;
    const diff = getSignedDistance(distance, direction);
    props.onMove({ ...data, end: clampEnd(diff) });
  };

  const handleBodyMove = (movementData: MovementData) => {
    const { distance, direction } = movementData;
    const diff = getSignedDistance(distance, direction);
    let newStart;
    let newEnd;
    // We need to use the new value for start, otherwise (when moving to the left)
    // in cases when the diff value is bigger than the interval's width,
    // the new end value may end up further to the left than the original left value.
    if (direction === Direction.Left) {
      newStart = clampStart(diff);
      newEnd = clamp(end + diff, newStart + INTERVAL_MIN_WIDTH, SCHEDULE_LENGTH);
    } else {
      newEnd = clampEnd(diff);
      newStart = clamp(start + diff, 0, newEnd - INTERVAL_MIN_WIDTH);
    }
    props.onMove({ ...data, start: newStart, end: newEnd });
  };

  const handleMoveEnd = () => {
    props.onMoveEnd({ ...data });
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const { pageX, pageY } = event;
    const { offsetX, offsetY } = event.nativeEvent;
    setIsMenuOpen(true);
    setIsInFocus(false);
    setMenuPositionGlobal({ x: pageX, y: pageY });
    setMenuPositionRelative({ x: offsetX, y: offsetY });
  };

  const addCloseHandler = (f: Function) => {
    f();
    setIsMenuOpen(false);
    setIsInFocus(false);
  };

  let contextMenuItems: any[] = [{
    name: 'Change type',
    submenu: activityTypes.map((activity: ActivityTypeData) => {
      return {
        name: activity.name,
        action: () => addCloseHandler(() => props.onTypeChange(id, activity.name)),
        attrs: {
          color: activity.color
        }
      };
    })
  }];

  if (canCreateInside(data)) {
    contextMenuItems = [{
      name: 'Create',
      action: () => addCloseHandler(() => props.onCreate(id))
    }, ...contextMenuItems];
  }

  if (!isEmpty) {
    contextMenuItems = [...contextMenuItems, {
      name: 'Remove',
      action: () => addCloseHandler(() => props.onRemove(id))
    }];
  }

  useEffect(() => {
    document.addEventListener('pointerdown', handleBlur);
    return () => {
      document.removeEventListener('pointerdown', handleBlur);
    };
  });

  return (
    <div
      className={styles.intervalItem}
      style={css}
      onPointerDown={handlePointerDown}
      onContextMenu={handleContextMenu}
      ref={domNode}
      title={type}
    >
      {!isEmpty && isInFocus && (
        <IntervalHandle
          direction={Direction.Left}
          onMove={handleLeftMove}
          onMoveEnd={handleMoveEnd}
          value={startRounded}
        />
      )}
      {!isEmpty && (
        <IntervalItemBody
          onMove={handleBodyMove}
          onMoveEnd={handleMoveEnd}
        />
      )}
      {!isEmpty && isInFocus && (
        <IntervalHandle
          direction={Direction.Right}
          onMove={handleRightMove}
          onMoveEnd={handleMoveEnd}
          value={endRounded}
        />
      )}
      {isMenuOpen && (
        <IntervalMenu
          items={contextMenuItems}
          positionGlobal={menuPositionGlobal}
          positionRelative={menuPositionRelative}
        />
      )}
    </div>
  );
};
