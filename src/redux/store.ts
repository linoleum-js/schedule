import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import { scheduleListsReducer } from './scheduleLists/scheduleListsStore';
import { uiStateReducer } from './uiState/uiStateStore';
import { activityTypesReducer } from './activityTypes/activityTypesStore';

const store = configureStore({
  reducer: {
    scheduleLists: scheduleListsReducer,
    uiState: uiStateReducer,
    activityTypes: activityTypesReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
