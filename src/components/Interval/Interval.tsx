
import { MovementData, ScheduleIntervalData } from '@/models';
import { IntervalItem } from '../IntervalItem/IntervalItem';

import styles from './Interval.module.css';

type IntervalProps = {
  data: ScheduleIntervalData[];
};

export const Interval = (props: IntervalProps) => {

  const onMove = (movementData: MovementData) => {
  };

  return (
    <div className={styles.Interval}>
      {props.data.map((item) => {
        return (
          <IntervalItem onMove={onMove} data={item} key={item.id} />
        );
      })}
    </div>
  );
};
