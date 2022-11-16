import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import {
  scheduleListsReducer, ScheduleListState
} from './scheduleLists/scheduleListsStore';
import { uiStateReducer, UiState } from './uiState/uiStateStore';

export interface AppState {
  scheduleLists: {
    past: ScheduleListState[];
    present: ScheduleListState;
    future: ScheduleListState[];
  };
  uiState: UiState;
}

const store = configureStore({
  reducer: {
    scheduleLists: scheduleListsReducer,
    uiState: uiStateReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;