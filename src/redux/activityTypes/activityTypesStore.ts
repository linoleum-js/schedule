import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { takeLatest, call, put, CallEffect, PutEffect } from 'redux-saga/effects';
import { ActivityTypeData } from '@/models';

import Api from '@/api';


export interface ActivityTypesState {
  error: string | null,
  isLoading: boolean,
  list: ActivityTypeData[]
}

const initialState: ActivityTypesState = {
  error: null,
  isLoading: false,
  list: [],
};

const slice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    fetchActivitiesAction: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchActivitiesSuccess: (state, action: PayloadAction<ActivityTypeData[]>) => {
      state.isLoading = false;
      state.error = null;
      state.list = action.payload;
      console.log
    },
    fetchActivitiesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchActivitiesAction, fetchActivitiesFailure, fetchActivitiesSuccess } = slice.actions;

// TODO create ScheduleAction, replace any
type FetchActivitiesReturnType = Generator<
  CallEffect<ActivityTypeData[]> | PutEffect <any>,
  void,
  ActivityTypeData[]
>;

function* fetchActivities(): FetchActivitiesReturnType {
  try {
    let list = yield call(Api.getActivities);
    yield put(fetchActivitiesSuccess(list));
  } catch (error: any) {
    yield put(fetchActivitiesFailure(error.message));
  }
}

export function* watchFetchActivities() {
  yield takeLatest(fetchActivitiesAction, fetchActivities);
}

export const activityTypesReducer = slice.reducer;
