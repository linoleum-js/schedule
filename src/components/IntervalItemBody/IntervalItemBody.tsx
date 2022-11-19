import {
  movableElement, MovableElementProps
} from '../MovableElement/MovableElement';

import styles from './IntervalItemBody.module.css';

const IntervalItemBody = () => {
  return (
    <div className={`${styles.IntervalItemBody}`} />
  );
};

export default movableElement<MovableElementProps>(IntervalItemBody);