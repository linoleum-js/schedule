
import { ScheduleData } from '../src/models';

const schedule: ScheduleData = {
  id: '123123',
  userName: '123123',
  list: [
    {
    start: 0,
    end: 60,
    type: 'Break',
    id: '111'
  },
  {
    start: 120,
    end: 180,
    type: 'Work',
    id: '222'
  }
  , {
    start: 240,
    end: 300,
    type: 'Work',
    id: '333'
  }
  , {
    start: 360,
    end: 720,
    type: 'Work',
    id: '444'
  }
]
};

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
];

const generateUsers = () => {
  const res: ScheduleData[] = [];

  for (let name of names) {
    res.push({ ...schedule, userName: name, id: name })
  }

  return res;
};


export const scheduleData: ScheduleData[] = generateUsers();