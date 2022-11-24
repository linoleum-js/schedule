import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import undoable from 'redux-undo';
import { call, put, takeLatest, CallEffect, PutEffect } from 'redux-saga/effects';

import { ScheduleData } from '@/models';
import Api from '@/api/api';
import { addEmptyIntervals, generateIds } from '@/util/scheduleInputUtil';

export interface ScheduleListState {
  isLoading: boolean;
  list: ScheduleData[];
  error: string | null;
}

export enum ScheduleActionTypes {
  fetchScheduleAction = 'fetchScheduleAction',
  fetchScheduleSuccess = 'fetchScheduleSuccess',
  fetchScheduleFailure = 'fetchScheduleFailure',
  updateSchedule = 'updateSchedule',
  scheduleUndo = 'scheduleUndo',
  scheduleRedo = 'scheduleRedo',
  UndoRedoInit = '@@redux-undo/INIT',
}

const initialState: ScheduleListState = {
  list: [],
  isLoading: false,
  error: null
};

const slice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    [ScheduleActionTypes.fetchScheduleAction]: (state) => {
      state.error = null;
      state.isLoading = true;
    },
    [ScheduleActionTypes.fetchScheduleSuccess]: (state, action: PayloadAction<ScheduleData[]>) => {
      const { payload } = action;
      state.isLoading = false;
      state.error = null;
      state.list = payload;
    },
    [ScheduleActionTypes.fetchScheduleFailure]: (state, action: PayloadAction<string>) => {
      const { payload } = action;
      state.isLoading = false;
      state.error = payload;
    },

    [ScheduleActionTypes.updateSchedule]: (state, action: PayloadAction<ScheduleData>) => {
      const { payload: schedule } = action;
      const { list } = state;
      const index: number = list.findIndex((item) => item.id === schedule.id);
      const prevItems: ScheduleData[] = list.slice(0, index);
      const nextItems: ScheduleData[] = list.slice(index + 1);
      const newList = [...prevItems, addEmptyIntervals(schedule), ...nextItems];

      state.list = newList;
    }
  }
});

export const { updateSchedule, fetchScheduleSuccess, fetchScheduleFailure, fetchScheduleAction } = slice.actions;


// TODO create ScheduleAction
type FetchScheduleReturnType = Generator<CallEffect<ScheduleData[]> | PutEffect <any>, void, ScheduleData[]>;
function* fetchSchedule(): FetchScheduleReturnType {
  try {
    let list = yield call(Api.getSchedule);
    list = list.map((item: ScheduleData) => addEmptyIntervals(generateIds(item)));
    console.log('before yield put');
    yield put(fetchScheduleSuccess(list));
  } catch (error: any) {
    yield put(fetchScheduleFailure(error.message));
  }
}

export function* watchFetchSchedule() {
  yield takeLatest(fetchScheduleAction, fetchSchedule);
}

export const scheduleListsReducer = undoable(slice.reducer, {
  undoType: ScheduleActionTypes.scheduleUndo,
  redoType: ScheduleActionTypes.scheduleRedo,
  initTypes: ['@@redux-undo/INIT'],
  ignoreInitialState: true
})