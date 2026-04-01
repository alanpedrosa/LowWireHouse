import React, { useRef } from 'react';
import { useCanvasSync } from '../../features/canvas/useCanvasSync';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addElement } from '../../store/slices/documentSlice';
import { v4 as uuidv4 } from 'uuid';

export const CanvasArea: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useAppDispatch();
  const activeTool = useAppSelector(state => state.ui.activeTool);
  
  const { fabricCanvas } = useCanvasSync(canvasRef);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (activeTool === 'select' || !fabricCanvas) return;
    
    // Convert to canvas coordinates
    const pointer = fabricCanvas.getPointer(e.nativeEvent as any);
    
    // Add default shape at pointer
    const defaultData = {
      id: uuidv4(),
      x: pointer.x - 50,
      y: pointer.y - 30,
      width: Math.max(100, 100),
      height: Math.max(60, 60),
      rotation: 0,
      opacity: 1,
      stroke: '#111827',
      strokeWidth: 2,
      fill: 'transparent'
    };

    if (activeTool === 'rectangle') {
      dispatch(addElement({ ...defaultData, type: 'rectangle' } as any));
    } else if (activeTool === 'ellipse') {
      dispatch(addElement({ ...defaultData, type: 'ellipse' } as any));
    } else if (activeTool === 'text') {
      dispatch(addElement({ ...defaultData, type: 'text', text: 'Text', fontSize: 16, fontFamily: 'sans-serif', textAlign: 'left', fill: '#111827', strokeWidth: 0 } as any));
    }
    // We could reset tool to select immediately after creation for flow
    // dispatch(setActiveTool('select'));
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const toolId = e.dataTransfer.getData('application/reactflow');
    if (!toolId || !fabricCanvas) return;

    // Get pointer coordinates relative to canvas
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left - 50;
    const y = e.clientY - rect.top - 30;

    const defaultData = {
      id: uuidv4(),
      x,
      y,
      width: 100,
      height: 60,
      rotation: 0,
      opacity: 1,
      stroke: '#111827',
      strokeWidth: 2,
      fill: 'transparent'
    };

    if (toolId === 'rectangle') {
      dispatch(addElement({ ...defaultData, type: 'rectangle' } as any));
    } else if (toolId === 'ellipse') {
      dispatch(addElement({ ...defaultData, type: 'ellipse' } as any));
    } else if (toolId === 'text') {
      dispatch(addElement({ ...defaultData, type: 'text', text: 'Text', fontSize: 16, fontFamily: 'sans-serif', textAlign: 'left', fill: '#111827', strokeWidth: 0 } as any));
    } else if (toolId === 'line') {
       dispatch(addElement({ ...defaultData, type: 'line', width: 100, height: 2 } as any));
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 bg-wire-light w-full h-full overflow-hidden"
      onPointerDown={handlePointerDown}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#D1D5DB 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>
      
      <canvas ref={canvasRef} id="fabric-canvas" className="absolute z-10" />
    </div>
  );
};
