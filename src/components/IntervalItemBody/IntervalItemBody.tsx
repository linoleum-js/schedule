import {
  movableElement, MovableElementProps
} from '../MovableElement/MovableElement';

import styles from './IntervalItemBody.module.css';

const IntervalItemBody = (props: MovableElementProps) => {
  return <div className={`${styles.IntervalItemBody}`}></div>;
};

export default movableElement<MovableElementProps>(IntervalItemBody);