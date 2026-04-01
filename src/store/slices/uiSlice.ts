import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../../types/state';

export const initialState: UIState = {
  selectedElementIds: [],
  activeTool: 'select',
  isDragging: false,
  zoom: 1,
  isAIModalOpen: false,
  isSettingsModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedElementIds: (state, action: PayloadAction<string[]>) => {
      state.selectedElementIds = action.payload;
    },
    setActiveTool: (state, action: PayloadAction<UIState['activeTool']>) => {
      state.activeTool = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setAIModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAIModalOpen = action.payload;
    },
    setSettingsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsModalOpen = action.payload;
    },
  },
});

export const { setSelectedElementIds, setActiveTool, setZoom, setAIModalOpen, setSettingsModalOpen } = uiSlice.actions;

export default uiSlice.reducer;
