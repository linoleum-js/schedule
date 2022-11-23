import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import { scheduleListsReducer, ScheduleListState } from './scheduleLists/scheduleListsStore';
import { uiStateReducer, UiState } from './uiState/uiStateStore';
import { activityTypesReducer, ActivityTypesState } from './activityTypes/activityTypesStore';

// 

const store = configureStore({
  reducer: {
    scheduleLists: scheduleListsReducer,
    uiState: uiStateReducer,
    activityTypes: activityTypesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
