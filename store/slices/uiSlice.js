import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leftPanelOpen: true,
  rightPanelOpen: false,
  rightPanelContent: null,
  theme: 'dark',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleLeftPanel: (state) => {
      state.leftPanelOpen = !state.leftPanelOpen;
    },

    setLeftPanel: (state, action) => {
      state.leftPanelOpen = action.payload;
    },

    toggleRightPanel: (state) => {
      state.rightPanelOpen = !state.rightPanelOpen;
    },

    setRightPanel: (state, action) => {
      state.rightPanelOpen = action.payload.open;
      state.rightPanelContent = action.payload.content;
    },

    closeRightPanel: (state) => {
      state.rightPanelOpen = false;
      state.rightPanelContent = null;
    },
  },
});

export const {
  toggleLeftPanel,
  setLeftPanel,
  toggleRightPanel,
  setRightPanel,
  closeRightPanel,
} = uiSlice.actions;

export default uiSlice.reducer;
