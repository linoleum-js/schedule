import { createSlice, PayloadAction, AnyAction } from '@reduxjs/toolkit';
import { takeLatest, call, put, CallEffect, PutEffect } from 'redux-saga/effects';

import Api from '@/api';

export interface CallLoadData {
  time: number;
  value: number;
}

export interface CallLoadState {
  error: string | null;
  isLoading: boolean;
  list: CallLoadData[];
}

const initialState: CallLoadState = {
  error: null,
  isLoading: false,
  list: [],
};

const slice = createSlice({
  name: 'callLoad',
  initialState,
  reducers: {
    fetchCallLoadAction: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCallLoadSuccess: (state, action: PayloadAction<CallLoadData[]>) => {
      state.isLoading = false;
      state.error = null;
      state.list = action.payload;
      console.log
    },
    fetchCallLoadFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchCallLoadAction, fetchCallLoadSuccess, fetchCallLoadFailure } = slice.actions;

type FetchCallLoadReturnType = Generator<
  CallEffect<CallLoadData[]> | PutEffect <AnyAction>,
  void,
  CallLoadData[]
>;

function* fetchCallLoad(): FetchCallLoadReturnType {
  try {
    let list = yield call(Api.getCallLoad);
    yield put(fetchCallLoadSuccess(list));
  } catch (error: any) {
    yield put(fetchCallLoadFailure(error.message));
  }
}

export function* watchFetchCallLoad() {
  yield takeLatest(fetchCallLoadAction, fetchCallLoad);
}

export const callLoadReducer = slice.reducer;
