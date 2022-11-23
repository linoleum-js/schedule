import { Reducer, Action } from 'redux';
import { findIndex } from 'lodash';
import undoable from 'redux-undo';

import { ScheduleData } from '@/models';
import { addEmptyIntervals, generateIds } from '@/util/scheduleInputUtil';

import { mockData } from '../../../mock-data/intervals';


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

export const updateSchedule = (data: ScheduleData) => (dispatch: Function) => {
  dispatch({
    type: ScheduleActionTypes.UpdateScheduleList,
    payload: data
  });
};

export const fetchScheduleList = () => async (dispatch: Function) => {
  dispatch({
    type: ScheduleActionTypes.ReceiveScheduleList,
    payload: mockData.map((item: ScheduleData) => addEmptyIntervals(generateIds(item)))
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
        list: [...prevItems, addEmptyIntervals(schedule), ...nextItems]
      };
  }

  return state;
};

export const scheduleListsReducer = undoable(scheduleListsReducerBody, {
  undoType: ScheduleActionTypes.UndoUpdateScheduleList,
  redoType: ScheduleActionTypes.RedoUpdateScheduleList,
  initTypes: ['@@redux-undo/INIT'],
  ignoreInitialState: true
})