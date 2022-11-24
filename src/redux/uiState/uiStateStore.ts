import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  widthInPixels: number;
  stepSizeInPixels: number;
}

const initialState: UiState = {
  widthInPixels: 1,
  stepSizeInPixels: 1
};

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    updateUiState: (state, action: PayloadAction<UiState>) => {
      const { payload } = action;
      state.stepSizeInPixels = payload.stepSizeInPixels ?? state.stepSizeInPixels;
      state.widthInPixels = payload.widthInPixels ?? state.widthInPixels;
    }
  }
});

export const { updateUiState } = slice.actions;

export const uiStateReducer = slice.reducer;
