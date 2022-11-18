
import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { throttle } from 'lodash';

import { MovementData, Direction } from '@/models';
import { AppState } from '@/redux';
import { pixelsToMinutes } from '@/util';
import { stepSizeInMinutes } from '@/constants';


export interface MovableElementProps {
  onMove: (data: MovementData) => void;
  onMoveEnd: () => void;
  name?: string;
}

export function movableElement<T extends MovableElementProps> (
  Component: React.JSXElementConstructor<T>
) {
  return function MovableElement (props: T) {
    const uiState = useSelector((state: AppState) => state.uiState);
    const isDragging = useRef(false);
    const lastX = useRef(0);

    const { onMove, onMoveEnd } = props;

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging.current) {
        return;
      }
      const { pageX } = event;
      const diff = pageX - lastX.current;
      // console.log('pageX, lastX.current', pageX, lastX.current);
      onMove({
        distance: pixelsToMinutes(Math.abs(diff), stepSizeInMinutes, uiState.stepSizeInPixels),
        direction: diff > 0 ? Direction.Right : Direction.Left
      });
    };

    const throttledMouseMove = useMemo(
      () => throttle(onMouseMove, 70),
      []
    );
    // const throttledMouseMove = onMouseMove;
    
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

    useEffect(() => {
      document.addEventListener('mousemove', throttledMouseMove, false);
      document.addEventListener('pointerup', onDragEnd, false);
      return () => {
        document.removeEventListener('mousemove', throttledMouseMove, false);
        document.removeEventListener('pointerup', onDragEnd, false);
      };
    });

    return (
      <div
        onPointerDown={onDragStart}
      >
        <Component {...props} />
      </div>
    );
  };
};