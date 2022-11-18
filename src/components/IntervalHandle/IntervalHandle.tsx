import clsx from 'clsx';


import { Direction } from '@/models';
import { movableElement, MovableElementProps } from '../MovableElement/MovableElement';
import { movableElement2 } from '../MovableElement/MovableElement2';

import styles from './IntervalHandle.module.css';

interface IntervalHandleProps {
  direction: Direction
}

const IntervalHandleComponent = (props: IntervalHandleProps) => {
  const classes = clsx(
    styles.IntervalHandle,
    {
      [styles.IntervalHandleLeft]: props.direction === Direction.Left,
      [styles.IntervalHandleRight]: props.direction === Direction.Right
    }
  );

  return (
    <div className={classes}>
      <div className={styles.IntervalHandleBody}>
        17:25
      </div>
    </div>
  );
};

// TODO remove any
export const IntervalHandle = movableElement2<any>(IntervalHandleComponent);