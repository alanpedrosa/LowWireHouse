import { WireframeElement } from './elements';

export interface UIState {
  selectedElementIds: string[];
  activeTool: 'select' | 'rectangle' | 'ellipse' | 'text' | 'line' | 'image';
  isDragging: boolean;
  zoom: number;
  isAIModalOpen: boolean;
  isSettingsModalOpen: boolean;
}

export interface DocumentState {
  elements: WireframeElement[];
  canvasWidth: number;
  canvasHeight: number;
  gridEnabled: boolean;
  gridSize: number;
}
