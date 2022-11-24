
import { useSearchParams } from 'react-router-dom';
import moment from 'moment';

import { formatDateDisplay, parseDate, formatDate } from '@/util';

import styles from './IntervalDateNavigation.module.css';

export const IntervalDateNavigation = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  const dateString = searchParams.get('date') ?? formatDateDisplay(moment(Date.now()));
  const date = parseDate(dateString);
  const prevDay = moment(date).subtract(1, 'd');
  const nextDay = moment(date).add(1, 'd');

  const onPrevClick = () => {
    setSearchParams({ date: formatDate(prevDay) });
  };

  const onNextClick = () => {
    setSearchParams({ date: formatDate(nextDay) });
  };

  return (
    <>
      <div className={styles.intervalTableDividerLeft} onClick={onPrevClick}>
        <span>{formatDateDisplay(prevDay)}</span>
      </div>
      <div className={styles.intervalTableDividerRight} onClick={onNextClick}>
        <span>{formatDateDisplay(nextDay)}</span>
      </div>
    </>
  );
};