import { SCHEDULE_LENGTH } from '@/constants';
import { v4 as uuidv4, v4 } from 'uuid';

import { ScheduleData } from '../src/models';

const names = [
  'Cleo Bowes Cleo Bowes Cleo Bowes',
  'Jagdeep Cairns',
  'Anisa Olsen',
  'Asiyah Wilson',
  'Kelsi Stevenson',
  'Benas Stott',
  'Caleb Hubbard',
  'Nikola Stone',
  'Shauna Mckenzie',
  'Shakira Hess',
  'Ed Cohen',
  'Denny Cochran',
  'Irfan Mueller',
  'Krista Rodriguez',
  'Fannie Dalton',
  'Alix Gould',
  'Kajetan Robbins',
  'Cheyenne Watts',
  'Eshaal Nash',
  'Jena Bowman',
  'Seb Irwin',
  'Luella Simpson',
  'Madeeha Friedman',
  'Bree Whitworth',
  'Horace Burch',
  'Wilfred Beech',
  'India Jenkins',
  'Mared Morales',
  'Izabel Hobbs',
  'Lincoln Richard',
  'Lara Tang',
  'Huseyin Wade',
  'Jibril Cabrera',
  'Alyssa Mustafa',
  'Dora Fitzpatrick',
  'Jaylen Sargent',
  'Lacie Rowe',
  'Ziva Dunlop',
  'Zacharias Dickens',
  'Terri Duggan',
  'Kit Bentley',
  'Azaan Hurley',
  'Nichola Kerr',
  'Deanna Stevenson',
  'Tamika Humphreys',
  'Maximillian Rooney',
  'Uma Finney',
  'Jayson Franks',
  'Kelly Ratcliffe',
  'Griffin Herring',
  'Bartlomiej Brook',
  'Kaira Wiggins',
  'Harlow Sheehan',
  'Julien Riley',
  'Elaine Delacruz',
  'Yasmine Millington',
  'Lorelai Muir',
  'Lexi-May James',
  'Tahmid Hawes',
  'Keiron Tait',
  'Ezmae Kearney',
  'Hajrah Baker',
  'Zakariyya Fulton',
  'Tyler-Jay Donald',
  'Mayur Pitts',
  'Magdalena Castillo',
  'Lillie-May Allan',
  'Yvette Sharp',
  'Keziah Galvan',
  'Aditi Harper',
];

export const actualNames = [...names.slice(0, 40)];

const templateInterval = [{
  start: 0, end: 60 * 1.5, type: 'Work'
}, {
  start: 60 * 1.5, end: 60 * 1.75, type: 'Break'
}, {
  start: 60 * 1.75, end: 60 * 3.5, type: 'Work'
}, {
  start: 60 * 3, end: 60 * 4, type: 'Break'
}, {
  start: 60 * 4, end: 60 * 6, type: 'Work'
}, {
  start: 60 * 6, end: 60 * 6.25, type: 'Break'
}, {
  start: 60 * 6.25, end: 60 * 7.25, type: 'Training'
}, {
  start: 60 * 7.25, end: 60 * 9, type: 'Work'
}];

const addIntervalIds = (list: any) => list.map((item: any) => ({ ...item, id: v4() }));

const getTemplateInterval = () => addIntervalIds(templateInterval);

const getRandomOffset = (list: any) => {
  const max = 15 * 60;
  const offset = Math.floor(Math.random() * max);
  return list.map((item: any) => {
    return { ...item, start: item.start + offset, end: item.end + offset };
  });
};

const inject = (list: any, type: string) => {
  const number = Math.floor(list.length / 20);
  const indexes: number[] = [];
  for (let i = 0; i < number; i++) {
    indexes.push(Math.floor(Math.random() * list.length));
  }
  
  return list.map((item: any, index: number) => {
    if (indexes.includes(index)) {
      return {
        ...item,
        list: [{ start: 0, end: SCHEDULE_LENGTH, type }]
      };
    }
    return item;
  });
};

export const generateUsers = () => {
  const res: ScheduleData[] = [];

  for (let name of actualNames) {
    res.push({ list: getRandomOffset(getTemplateInterval()) , userName: name, id: v4() });
  }

  return inject(inject(res, 'Sick leave'), 'Vacation');
};
