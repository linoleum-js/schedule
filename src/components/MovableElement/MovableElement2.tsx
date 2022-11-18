
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// @ts-ignore
import { useThrottleCallback } from '@react-hook/throttle';
import { stepSizeInMinutes } from '@/constants';

// import { getMovementdata } from '@util/scheduleInputUtil';
import { Direction, MovementData } from '@/models';
import { AppState } from '@/redux/store';
import { pixelsToMinutes } from '@/util';

export interface MovableElementProps {
  onMove: (data: MovementData) => void;
  onMoveEnd: () => void;
}

export function movableElement2<T extends MovableElementProps> (
  Component: React.JSXElementConstructor<T>
) {
  return function MovableElement (props: T) {
    const uiState = useSelector((state: AppState) =>
      state.uiState
    );
    const { stepSizeInPixels } = uiState;
    const { onMove, onMoveEnd } = props;
    const [staticData] = useState({
      isDragging: false,
      lastX: 0
    });
    
    const onDragEnd = () => {
      if (staticData.isDragging) {
        onMoveEnd();
      }
      staticData.isDragging = false;
    };

    const onDragStart = (event: React.PointerEvent) => {
      const { pageX } = event;

      staticData.lastX = pageX;
      staticData.isDragging = true;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!staticData.isDragging) {
        return;
      }

      const { pageX } = event;
      // const movementData: MovementData = getMovementdata(
      //   pageX, staticData.lastX, stepSizeInPixels
      // );
      // const { distanceInSteps, lastX } = movementData;

      const diff = pageX - staticData.lastX;
      const direction = diff > 0 ? Direction.Right : Direction.Left;
      onMove({ distance: pixelsToMinutes(Math.abs(diff), stepSizeInMinutes, stepSizeInPixels), direction });
      staticData.lastX = pageX;
      // if (distanceInSteps) {
      //   staticData.lastX = lastX;
      //   onMove(movementData);
      // }
    };

    // const throttledMouseMove = useThrottleCallback(onMouseMove, 150);
    const throttledMouseMove = useThrottleCallback(onMouseMove, 150);

    useEffect(() => {
      document.addEventListener('mousemove', throttledMouseMove);
      document.addEventListener('pointerup', onDragEnd);
      return () => {
        document.removeEventListener('mousemove', throttledMouseMove);
        document.removeEventListener('pointerup', onDragEnd);
      };
    });

    
    return <div
      onPointerDown={onDragStart}
    >
      <Component {...props} />
    </div>;
  };
};