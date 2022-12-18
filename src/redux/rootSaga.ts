
import { all } from 'redux-saga/effects';

import { watchFetchSchedule } from './scheduleLists/scheduleListsStore';
import { watchFetchActivities } from './activityTypes/activityTypesStore';
import { watchFetchCallLoad } from './callLoad/callLoadStore';

export default function* rootSaga(): any {
  yield all([
    watchFetchSchedule(),
    watchFetchActivities(),
    watchFetchCallLoad(),
  ]);
}
