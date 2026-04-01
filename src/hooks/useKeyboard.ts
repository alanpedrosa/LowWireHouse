import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '.';
import { ActionCreators } from 'redux-undo';
import { deleteElements, addElement } from '../store/slices/documentSlice';
import { v4 as uuidv4 } from 'uuid';
import { WireframeElement } from '../types/elements';

export const useKeyboard = () => {
  const dispatch = useAppDispatch();
  const selectedIds = useAppSelector(state => state.ui.selectedElementIds);
  const elements = useAppSelector(state => state.document.present.elements);

  const clipboardRef = useRef<WireframeElement[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          dispatch(deleteElements(selectedIds));
        }
      }

      // Undo/Redo
      if (cmdOrCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch(ActionCreators.undo());
      }
      if ((cmdOrCtrl && e.key === 'y') || (cmdOrCtrl && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        dispatch(ActionCreators.redo());
      }

      // Copy
      if (cmdOrCtrl && e.key === 'c') {
        const selectedElements = elements.filter(el => selectedIds.includes(el.id));
        if (selectedElements.length > 0) {
          clipboardRef.current = selectedElements;
        }
      }

      // Paste
      if (cmdOrCtrl && e.key === 'v') {
        if (clipboardRef.current.length > 0) {
          clipboardRef.current.forEach(el => {
            dispatch(addElement({
              ...el,
              id: uuidv4(),
              x: el.x + 20,
              y: el.y + 20,
            } as any));
          });
        }
      }

      // Duplicate (Ctrl+D)
      if (cmdOrCtrl && e.key === 'd') {
        e.preventDefault();
        if (selectedIds.length > 0) {
          const selectedElements = elements.filter(el => selectedIds.includes(el.id));
          selectedElements.forEach(el => {
            dispatch(addElement({
              ...el,
              id: uuidv4(),
              x: el.x + 20,
              y: el.y + 20,
            } as any));
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, selectedIds, elements]);
};
