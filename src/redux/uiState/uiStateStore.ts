import { Reducer, Action } from 'redux';

export interface UiState {
  widthInPixels: number;
  stepSizeInPixels: number;
}

export enum UiStateActionTypes {
  UpdateUiState = 'UPDATE_UI_STATE'
}

export interface UpdateUiStateAction {
  type: UiStateActionTypes.UpdateUiState;
  payload: UiState;
}

export const updateUiState = (payload: UiState) => (dispatch: Function) => {
  dispatch({
    type: UiStateActionTypes.UpdateUiState,
    payload
  });
}

const initialState: UiState = {
  widthInPixels: 1,
  stepSizeInPixels: 1
};

export const uiStateReducer: Reducer<UiState> = (
  state: UiState = initialState,
  action: Action
): UiState => {
  const { type, payload } = action as UpdateUiStateAction;

  switch (type) {
    case UiStateActionTypes.UpdateUiState:
      return payload;
  }

  return state;
};