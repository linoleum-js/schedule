import {
  movableElement, MovableElementProps
} from '../MovableElement/MovableElement';

import styles from './IntervalItemBody.module.css';

const IntervalItemBody = () => {
  return (
    <div className={`${styles.intervalItemBody}`} />
  );
};

export default movableElement<MovableElementProps>(IntervalItemBody);