import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { scheduleListsReducer } from './scheduleLists/scheduleListsStore';
import { uiStateReducer } from './uiState/uiStateStore';
import { activityTypesReducer } from './activityTypes/activityTypesStore';
import { callLoadReducer } from './callLoad/callLoadStore';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    scheduleLists: scheduleListsReducer,
    uiState: uiStateReducer,
    activityTypes: activityTypesReducer,
    callLoad: callLoadReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware, logger),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
