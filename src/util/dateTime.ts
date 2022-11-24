
import moment, { Moment } from 'moment';

export const DATE_FORMAT = 'DD-MM-YYYY';
export const DATE_DISPLAY_FORMAT = 'DD.MM';
export const TIME_DISPLAY_FORMAT = 'HH:mm';

/**
 * @param value time in minutes
 * @returns time in HH:mm format
 */
export const formatTime = (value: number) => moment.utc(value * 60 * 1000).format(TIME_DISPLAY_FORMAT);

export const formatDateDisplay = (date: Moment) => date.format(DATE_DISPLAY_FORMAT);

export const formatDate = (date: Moment) => date.format(DATE_FORMAT);

export const parseDate = (date: string) => moment(date, DATE_FORMAT);
