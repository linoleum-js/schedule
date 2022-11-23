import clsx from 'clsx';

import { Direction } from '@/models';
import { mmToHHMM } from '@/util';
import { movableElement, MovableElementProps } from '../MovableElement/MovableElement';

import styles from './IntervalHandle.module.css';

interface IntervalHandleProps {
  direction: Direction;
  value: number;
}

const IntervalHandleComponent = (props: IntervalHandleProps) => {
  const classes = clsx(
    styles.intervalHandle,
    {
      [styles.intervalHandleLeft]: props.direction === Direction.Left,
      [styles.intervalHandleRight]: props.direction === Direction.Right
    }
  );

  return (
    <div className={classes}>
      <div className={styles.intervalHandleBody}>
        {mmToHHMM(props.value)}
      </div>
    </div>
  );
};

export const IntervalHandle = movableElement<MovableElementProps & IntervalHandleProps>(IntervalHandleComponent);