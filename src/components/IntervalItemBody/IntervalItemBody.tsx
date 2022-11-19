import {
  movableElement2, MovableElementProps
} from '../MovableElement/MovableElement2';

import styles from './IntervalItemBody.module.css';

const IntervalItemBody = () => {
  return <div className={`${styles.IntervalItemBody}`}></div>;
};

export default movableElement2<MovableElementProps>(IntervalItemBody);