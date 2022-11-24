import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import { scheduleListsReducer } from './scheduleLists/scheduleListsStore';
import { uiStateReducer } from './uiState/uiStateStore';
import { activityTypesReducer } from './activityTypes/activityTypesStore';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    scheduleLists: scheduleListsReducer,
    uiState: uiStateReducer,
    activityTypes: activityTypesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger, sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
