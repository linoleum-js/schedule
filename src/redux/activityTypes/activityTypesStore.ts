import { Reducer, Action } from 'redux';

import { mockData } from '../../../mock-data/activityTypes';

export interface ActivityTypeData {
  name: string;
  color: string;
  attrs?: { [key: string]: string }
}

export interface ActivityTypesState {
  isLoading: boolean,
  list: ActivityTypeData[]
}

export enum ActivityTypesActionTypes {
  ReceiveActivityType = 'REQUEST_ACTIVITY_TYPES'
}

export interface ActivityTypAction {
  type: ActivityTypesActionTypes.ReceiveActivityType;
  payload: ActivityTypesState;
}

export const recieveActivityTypes = (payload: ActivityTypesState) => (dispatch: Function) => {
  // TODO request 
  dispatch({
    type: ActivityTypesActionTypes.ReceiveActivityType,
    payload
  });
}

const initialState: ActivityTypesState = {
  isLoading: false,
  list: mockData
};

export const activityTypesReducer: Reducer<ActivityTypesState> = (
  state: ActivityTypesState = initialState,
  action: Action
): ActivityTypesState => {
  const { type, payload } = action as ActivityTypAction;

  switch (type) {
    case ActivityTypesActionTypes.ReceiveActivityType:
      return payload;
  }

  return state;
};