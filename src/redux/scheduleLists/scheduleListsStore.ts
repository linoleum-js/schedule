import { Reducer, Action } from 'redux';
import { findIndex } from 'lodash';
import undoable from 'redux-undo';

import { ScheduleData } from '@/models';
import {
  fillScheduleWithEmpty, addEmptyBoundaries, generateIds
} from '../../util/scheduleInputUtil';


// TODO move to another file
const schedule: any = {
  id: '123123',
  userName: '123123',
  list: [
  //   {
  //   start: 0,
  //   end: 60,
  //   type: 1,
  //   id: '111'
  // },
  // {
  //   start: 120,
  //   end: 180,
  //   type: 2,
  //   id: '222'
  // }
  // , {
  //   start: 240,
  //   end: 300,
  //   type: 2,
  //   id: '333'
  // }
  , {
    start: 360,
    end: 720,
    type: 2,
    id: '444'
  }
]
};

const schedule1: any = {
  id: '123123',
  userName: '123123',
  list: [
    {
    start: 0,
    end: 60,
    type: 1,
    id: '111'
  },
  {
    start: 250,
    end: 380,
    type: 2,
    id: '222'
  }
  , {
    start: 720,
    end: 780,
    type: 2,
    id: '333'
  }
  , {
    start: 1020,
    end: 1080,
    type: 2,
    id: '444'
  }
]
};

const names = [

'Cleo Bowes',
// 'Jagdeep Cairns',
// 'Anisa Olsen',
// 'Asiyah Wilson',
// 'Kelsi Stevenson',
// 'Benas Stott',
// 'Caleb Hubbard',
// 'Nikola Stone',
// 'Shauna Mckenzie',
// 'Shakira Hess',
// 'Ed Cohen',
// 'Denny Cochran',
// 'Irfan Mueller',
// 'Krista Rodriguez',
// 'Fannie Dalton',
// 'Alix Gould',
// 'Kajetan Robbins',
// 'Cheyenne Watts',
// 'Eshaal Nash',
// 'Jena Bowman',
// 'Seb Irwin',
// 'Luella Simpson',
// 'Madeeha Friedman',
// 'Bree Whitworth',
// 'Horace Burch',
// 'Wilfred Beech',
// 'India Jenkins',
// 'Mared Morales',
// 'Izabel Hobbs',
// 'Lincoln Richard',
];

const generateUsers = () => {
  const res = [];

  for (let name of names) {
    res.push({ ...schedule, userName: name, id: name })
  }

  return res;
};


const data: ScheduleData[] = generateUsers();

export interface ScheduleListState {
  isLoading: boolean;
  list: ScheduleData[];
}

export enum ScheduleActionTypes {
  RequestScheduleList = 'REQUEST_SCHEDULE_LIST',
  ReceiveScheduleList = 'RECEIVE_SCHEDULE_LIST',
  UpdateScheduleList = 'UPDATE_SCHEDULE_LIST',
  UndoUpdateScheduleList = 'UNDO_UPDATE_SCHEDULE_LIST',
  RedoUpdateScheduleList = 'REDO_UPDATE_SCHEDULE_LIST',
  UndoRedoInit = '@@redux-undo/INIT',
}

export interface UndoRedoInit {
  type: ScheduleActionTypes.UndoRedoInit
}

export interface ScheduleActionPayload {
  list: ScheduleData[];
  schedule: ScheduleData;
}

export interface RequestScheduleListAction {
  type: ScheduleActionTypes.RequestScheduleList;
}

export interface ReceiveScheduleListAction {
  type: ScheduleActionTypes.ReceiveScheduleList;
  payload: ScheduleData[];
}

export interface UpdateScheduleAction {
  type: ScheduleActionTypes.UpdateScheduleList;
  payload: ScheduleData;
}

export type ScheduleAction =
  RequestScheduleListAction |
  ReceiveScheduleListAction |
  UpdateScheduleAction |
  UndoRedoInit;

// TODO remove any
export const updateSchedule: any = (data: ScheduleData) => (dispatch: Function) => {
  dispatch({
    type: ScheduleActionTypes.UpdateScheduleList,
    payload: data
  });
};

// TODO replace any
export const fetchScheduleList: any = () => async (dispatch: Function) => {
  dispatch({
    type: ScheduleActionTypes.ReceiveScheduleList,
    payload: data.map((item: ScheduleData) => fillScheduleWithEmpty(generateIds(item)))
  });
};

export const undoUpdateSchedule = () => {
  return {
    type: ScheduleActionTypes.UndoUpdateScheduleList
  };
};

export const redoUpdateSchedule = () => {
  return {
    type: ScheduleActionTypes.RedoUpdateScheduleList
  };
};

const initialState: ScheduleListState = {
  list: [],
  isLoading: false
};

const scheduleListsReducerBody: Reducer<ScheduleListState> = (
  state: ScheduleListState = initialState,
  action: Action
): ScheduleListState => {
  const { type } = action as ScheduleAction;

  switch (type) {
    case ScheduleActionTypes.RequestScheduleList:
      return {
        isLoading: true,
        list: []
      };

    case ScheduleActionTypes.ReceiveScheduleList:  
      const { payload: scheduleList } = action as ReceiveScheduleListAction;
      return {
        isLoading: false,
        list: scheduleList
      };

    case ScheduleActionTypes.UpdateScheduleList:
      const { payload: schedule } = action as UpdateScheduleAction;
      const { list } = state;
      const index: number = findIndex(list, { id: schedule.id });
      const prevItems: ScheduleData[] = list.slice(0, index);
      const nextItems: ScheduleData[] = list.slice(index + 1);

      return {
        isLoading: false,
        list: [...prevItems, addEmptyBoundaries(schedule), ...nextItems]
      };
  }

  return state;
};

// export const scheduleListsReducer = (a: any, b: any) => {
//   return {
//     past: [],
//     present: scheduleListsReducerBody(a?.present, b),
//     future: []
//   };
// };

export const scheduleListsReducer = undoable(scheduleListsReducerBody, {
  undoType: ScheduleActionTypes.UndoUpdateScheduleList,
  redoType: ScheduleActionTypes.RedoUpdateScheduleList,
  initTypes: ['@@redux-undo/INIT'],
  ignoreInitialState: true
})