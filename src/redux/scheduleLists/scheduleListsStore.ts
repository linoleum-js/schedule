import { AnyAction, createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import { call, put, takeLatest, CallEffect, PutEffect } from 'redux-saga/effects';

import { ScheduleData } from '@/models';
import Api from '@/api';
import { addEmptyIntervals, generateIds } from '@/util/interval';

export interface ScheduleListState {
  isLoading: boolean;
  list: ScheduleData[];
  error: string | null;
}

enum ScheduleActionTypes {
  scheduleUndo = 'scheduleUndo',
  scheduleRedo = 'scheduleRedo',
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
    fetchScheduleAction: (state, action: PayloadAction<string>) => {
      state.error = null;
      state.isLoading = true;
    },
    fetchScheduleSuccess: (state, action: PayloadAction<ScheduleData[]>) => {
      const { payload } = action;
      state.isLoading = false;
      state.error = null;
      state.list = payload;
    },
    fetchScheduleFailure: (state, action: PayloadAction<string>) => {
      const { payload } = action;
      state.isLoading = false;
      state.error = payload;
    },
    updateSchedule: (state, action: PayloadAction<ScheduleData>) => {
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

export const {
  updateSchedule, fetchScheduleSuccess, fetchScheduleFailure, fetchScheduleAction
} = slice.actions;
export const undoUpdateSchedule = createAction(ScheduleActionTypes.scheduleUndo);
export const redoUpdateSchedule = createAction(ScheduleActionTypes.scheduleRedo);

type FetchScheduleReturnType = Generator<
CallEffect<ScheduleData[]> | PutEffect <AnyAction>,
void,
ScheduleData[]
>;

function* fetchSchedule(action: PayloadAction<string>): FetchScheduleReturnType {
  try {
    let list = yield call(Api.getSchedule, action.payload);
    list = list.map((item: ScheduleData) => addEmptyIntervals(generateIds(item)));
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
  ignoreInitialState: true
});
