export type ElementType = 'rectangle' | 'ellipse' | 'text' | 'line' | 'image';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
}

export interface ShapeElement extends BaseElement {
  type: 'rectangle' | 'ellipse';
  rx?: number; // for rounded rectangles
  ry?: number;
}

export interface LineElement extends BaseElement {
  type: 'line';
  points: [number, number, number, number]; // x1, y1, x2, y2
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
}

export type WireframeElement = ShapeElement | TextElement | LineElement | ImageElement;
