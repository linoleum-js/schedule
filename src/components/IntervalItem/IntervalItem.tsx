
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import IntervalItemBody from '../IntervalItemBody/IntervalItemBody';
import { MovementData, ScheduleIntervalData, ActivityTypeEmpty } from '@/models';
import { AppState } from '@/redux';
import { stepSizeInMinutes } from '@/constants';
import { minutesToPixels } from '@/util';

import styles from './IntervalItem.module.css';

/**
 * 
 */


interface IntervalItemProps {
  onMove: (movementData: MovementData) => void;
  data: ScheduleIntervalData;
}

// TODO create utility
const getBg = (type: string | number) => {
  return {
    [ActivityTypeEmpty]: 'transparent',
    1: '#ffbc48',
    2: '#48bd54'
  }[type];
};

export const IntervalItem = (props: IntervalItemProps) => {
  const uiState = useSelector((state: AppState) => state.uiState);

  useEffect(() => {

    document.addEventListener('mousemove', () => {

    });
  });
  
  // TODO refactor
  const css = {
    left: minutesToPixels(props.data.start, stepSizeInMinutes, uiState.stepSizeInPixels),
    width: minutesToPixels(props.data.end - props.data.start, stepSizeInMinutes, uiState.stepSizeInPixels),
    backgroundColor: getBg(props.data.type)
  };

  const onBodyMove = (data: any) => {
    console.log('onBodyMove', data);
  };

  return (
    <div className={styles.IntervalItem} style={css}>
      {/* <div style={{ position: 'absolute', backgroundColor: '#000', left: '-10px', zIndex: 200 }}>flag</div> */}
      <IntervalItemBody
        onMove={onBodyMove}
        onMoveEnd={() => {}}
      />
    </div>
  );
};
