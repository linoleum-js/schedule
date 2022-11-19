
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useThrottleCallback } from '@react-hook/throttle';

import { STEP_SIZE_IN_MINUTES } from '@/constants';
import { Direction, MovementData } from '@/models';
import { AppState } from '@/redux/store';
import { pixelsToMinutes } from '@/util';

export interface MovableElementProps {
  onMove: (data: MovementData) => void;
  onMoveEnd: () => void;
}

export function movableElement<T extends MovableElementProps> (
  Component: React.JSXElementConstructor<T>
) {
  return function MovableElement (props: T) {
    const uiState = useSelector((state: AppState) => state.uiState);
    const { stepSizeInPixels } = uiState;
    const { onMove, onMoveEnd } = props;
    const isDragging = useRef(false);
    const lastX = useRef(0);
    
    const onDragEnd = () => {
      if (isDragging.current) {
        onMoveEnd();
      }
      isDragging.current = false;
    };

    const onDragStart = (event: React.PointerEvent) => {
      const { pageX } = event;

      lastX.current = pageX;
      isDragging.current = true;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging.current) {
        return;
      }

      const { pageX } = event;

      const diff = pageX - lastX.current;
      if (!diff) {
        return;
      }
      const direction = diff > 0 ? Direction.Right : Direction.Left;
      onMove({
        distance: pixelsToMinutes(Math.abs(diff), STEP_SIZE_IN_MINUTES, stepSizeInPixels),
        direction
      });
      lastX.current = pageX;
    };

    const throttledMouseMove = useThrottleCallback(onMouseMove, 150);

    useEffect(() => {
      document.addEventListener('mousemove', throttledMouseMove);
      document.addEventListener('pointerup', onDragEnd);
      return () => {
        document.removeEventListener('mousemove', throttledMouseMove);
        document.removeEventListener('pointerup', onDragEnd);
      };
    });

    
    return (
      <div onPointerDown={onDragStart}>
        <Component {...props} />
      </div>
    );
  };
};