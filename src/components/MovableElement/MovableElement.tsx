
import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { throttle } from 'lodash';

import { MovementData, Direction } from '@/models';
import { AppState } from '@/redux';
import { pixelsToMinutes } from '@/util';
import { stepSizeInMinutes } from '@/constants';


export interface MovableElementProps {
  onMove: (data: MovementData) => void;
  onMoveEnd: (data: MovementData) => void;
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
      onMove({
        distance: pixelsToMinutes(Math.abs(diff), stepSizeInMinutes, uiState.stepSizeInPixels),
        direction: diff > 0 ? Direction.Right : Direction.Left
      });
    };

    const throttledMouseMove = useMemo(
      () => throttle(onMouseMove, 50),
      []
    );
    
    const onDragEnd = (event: PointerEvent) => {
      const { pageX } = event;
      const diff = pageX - lastX.current;

      if (isDragging.current) {
        onMoveEnd({
        distance: Math.abs(diff),
        direction: diff > 0 ? Direction.Right : Direction.Left
      });
      }
      isDragging.current = false;
    };

    const onDragStart = (event: React.PointerEvent) => {
      const { pageX } = event;

      lastX.current = pageX;
      isDragging.current = true;
    };

    useEffect(() => {
      document.addEventListener('mousemove', throttledMouseMove);
      document.addEventListener('pointerup', onDragEnd);
      return () => {
        document.removeEventListener('mousemove', throttledMouseMove);
        document.removeEventListener('pointerup', onDragEnd);
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