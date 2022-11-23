import { Reducer, Action } from 'redux';

const list = [{
  name: 'Work',
  color: '#48bd54'
}, {
  name: 'Break',
  color: '#ffbc48'
}, {
  name: 'Training',
  color: '#5266b9'
}, {
  name: 'Sick leave',
  color: '#c371d3'
}, {
  name: 'Vacation',
  color: '#b3b3b3'
}, {
  name: 'Empty',
  color: 'transparent'
}];

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

// TODO replace any
export const recieveActivityTypes: any = (payload: ActivityTypesState) => (dispatch: Function) => {
  // TODO request 
  dispatch({
    type: ActivityTypesActionTypes.ReceiveActivityType,
    payload
  });
}

const initialState: ActivityTypesState = {
  isLoading: false,
  list
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