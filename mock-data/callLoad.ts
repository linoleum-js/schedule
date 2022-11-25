
import { STEP_SIZE_IN_MINUTES, SCHEDULE_LENGTH, STEPS_PER_DAY } from '@/constants';
import { CallLoadData } from '@/redux';

import { actualNames } from './intervals';

const generateCallLoad = () => {
  const result: CallLoadData[] = [];
  const maxValue = actualNames.length / 2;
  const diff = maxValue / STEPS_PER_DAY * 2 * 1.1;
  let value = 0;

  for (let time = 0; time < SCHEDULE_LENGTH; time += STEP_SIZE_IN_MINUTES) {
    const random = Math.random() * diff * 5;
    if (time < SCHEDULE_LENGTH / 2) {
      const sign = Math.random() > 0.3 ? 1 : -1;
      value += random * sign;
    } else {
      const sign = Math.random() > 0.3 ? 1 : -1;
      value -= random * sign;
    }
    if (value < 0) {
      value = 0;
    }
    result.push({ time, value });
  }
  return result;
};

export const callLoad = generateCallLoad();