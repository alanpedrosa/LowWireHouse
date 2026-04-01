import { configureStore } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import documentReducer from './slices/documentSlice';
import uiReducer from './slices/uiSlice';
import { StateWithHistory } from 'redux-undo';
import { DocumentState } from '../types/state';

export const store = configureStore({
  reducer: {
    // Wrap document reducer with undoable to enable undo/redo history for the document only
    document: undoable(documentReducer, {
      limit: 50, // Limit history to last 50 actions
    }) as any,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Fabric objects might trigger this if they leak in, though we only store basic POJOs in document
    }),
});

export type AppDispatch = typeof store.dispatch;

export interface RootState {
  document: StateWithHistory<DocumentState>;
  ui: ReturnType<typeof uiReducer>;
}
