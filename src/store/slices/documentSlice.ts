import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WireframeElement } from '../../types/elements';
import { DocumentState } from '../../types/state';

const initialState: DocumentState = {
  elements: [],
  canvasWidth: 1024,
  canvasHeight: 768,
  gridEnabled: true,
  gridSize: 20,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    addElement: (state, action: PayloadAction<WireframeElement>) => {
      state.elements.push(action.payload);
    },
    updateElement: (state, action: PayloadAction<{ id: string; changes: Partial<WireframeElement> }>) => {
      const { id, changes } = action.payload;
      const element = state.elements.find(el => el.id === id);
      if (element) {
        Object.assign(element, changes);
      }
    },
    deleteElements: (state, action: PayloadAction<string[]>) => {
      state.elements = state.elements.filter(el => !action.payload.includes(el.id));
    },
    setGridEnabled: (state, action: PayloadAction<boolean>) => {
      state.gridEnabled = action.payload;
    },
    setDocumentState: (state, action: PayloadAction<DocumentState>) => {
      return action.payload;
    }
  },
});

export const { addElement, updateElement, deleteElements, setGridEnabled, setDocumentState } = documentSlice.actions;

export default documentSlice.reducer;
