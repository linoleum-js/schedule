
import { all } from 'redux-saga/effects';

import { watchFetchSchedule } from './scheduleLists/scheduleListsStore';
import { watchFetchActivities } from './activityTypes/activityTypesStore';

export default function* rootSaga() {
  yield all([
    watchFetchSchedule(),
    watchFetchActivities(),
  ]);
}
