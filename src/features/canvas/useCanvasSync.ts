import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addElement, updateElement, deleteElements } from '../../store/slices/documentSlice';
import { setSelectedElementIds } from '../../store/slices/uiSlice';
import { WireframeElement } from '../../types/elements';
import { v4 as uuidv4 } from 'uuid';

export const useCanvasSync = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const dispatch = useAppDispatch();

  // Read state
  const elements = useAppSelector(state => state.document.present.elements);
  const gridEnabled = useAppSelector(state => state.document.present.gridEnabled);
  const gridSize = useAppSelector(state => state.document.present.gridSize);
  const uiState = useAppSelector(state => state.ui);

  const isSyncingRef = useRef(false);

  // Initialize Canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvas) return;

    const parent = canvasRef.current.parentElement;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: parent?.clientWidth || 800,
      height: parent?.clientHeight || 600,
      selection: true,
      preserveObjectStacking: true, // Keep absolute z-index
      backgroundColor: 'transparent'
    });

    // Custom wireframe styles for selection handles
    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#ffffff',
      cornerStrokeColor: '#3B82F6',
      borderColor: '#3B82F6',
      cornerSize: 8,
      padding: 5,
      cornerStyle: 'rect'
    });

    setFabricCanvas(canvas);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        canvas.setWidth(entry.contentRect.width);
        canvas.setHeight(entry.contentRect.height);
        canvas.renderAll();
      }
    });

    if (parent) resizeObserver.observe(parent);

    return () => {
      if (parent) resizeObserver.unobserve(parent);
      canvas.dispose();
    };
  }, [canvasRef]);

  // Handle Redux -> Fabric sync
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // We only update if we aren't currently mutating FROM fabric.
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    // A simple basic sync - in a larger app we would track added/removed specifically
    // but for 500 objects, clearing and rebuilding or syncing by ID works.
    // For performance, let's just make a simple ID based sync.
    const fabricObjects = fabricCanvas.getObjects();
    const fabricObjectIds = new Set(fabricObjects.map(obj => obj.name));

    // Remove deleted objects
    const elIds = new Set(elements.map(e => e.id));
    fabricObjects.forEach(obj => {
      if (obj.name && !elIds.has(obj.name)) {
        fabricCanvas.remove(obj);
      }
    });

    // Add or update
    elements.forEach(el => {
      const existingObj = fabricObjects.find(obj => obj.name === el.id);

      if (existingObj) {
        // Update
        if (el.type === 'ellipse') {
          existingObj.set({ rx: el.width / 2, ry: el.height / 2 } as any);
        } else {
          existingObj.set({ width: el.width, height: el.height } as any);
        }

        existingObj.set({
          left: el.x,
          top: el.y,
          scaleX: 1,
          scaleY: 1,
          angle: el.rotation,
          fill: el.fill || 'transparent',
          stroke: el.stroke || '#111827',
          strokeWidth: typeof el.strokeWidth === 'number' ? el.strokeWidth : 2,
          opacity: el.opacity,
        } as any);
        
        if (el.type === 'text' && existingObj.type === 'i-text') {
            const textEl = el as any;
            (existingObj as fabric.IText).set({ 
              text: textEl.text,
              fontSize: textEl.fontSize,
            });
        }
      } else {
        // Add
        let newObj: fabric.Object | null = null;
        const baseOptions = {
          name: el.id,
          left: el.x,
          top: el.y,
          width: el.width,
          height: el.height,
          angle: el.rotation,
          fill: el.fill || 'transparent',
          stroke: el.stroke || '#111827',
          strokeWidth: el.strokeWidth || 2,
          opacity: el.opacity,
        };

        if (el.type === 'rectangle') {
          newObj = new fabric.Rect({ ...baseOptions });
        } else if (el.type === 'ellipse') {
          newObj = new fabric.Ellipse({ 
            ...baseOptions, 
            rx: el.width / 2, 
            ry: el.height / 2 
          });
        } else if (el.type === 'text') {
          const textEl = el as any;
          newObj = new fabric.IText(textEl.text, {
            ...baseOptions,
            fontSize: textEl.fontSize || 16,
            fontFamily: textEl.fontFamily || 'sans-serif',
            textAlign: textEl.textAlign || 'left',
          });
        }

        if (newObj) {
          fabricCanvas.add(newObj);
        }
      }
    });

    fabricCanvas.renderAll();
    isSyncingRef.current = false;

  }, [elements, fabricCanvas]);

  // Handle Export Event
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleExportEvent = () => {
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2 // High res
      });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `wireframe-${new Date().getTime()}.png`;
      link.click();
    };

    window.addEventListener('export-canvas-png', handleExportEvent);
    return () => window.removeEventListener('export-canvas-png', handleExportEvent);
  }, [fabricCanvas]);

  // Handle Fabric -> Redux Sync
  useEffect(() => {
    if (!fabricCanvas) return;

    const modifiedHandler = (e: fabric.IEvent) => {
      if (!e.target || !e.target.name) return;
      isSyncingRef.current = true;
      
      const rawWidth = (e.target.width || 0) * (e.target.scaleX || 1);
      const rawHeight = (e.target.height || 0) * (e.target.scaleY || 1);
      const rawX = e.target.left || 0;
      const rawY = e.target.top || 0;

      const finalX = gridEnabled ? Math.round(rawX / gridSize) * gridSize : rawX;
      const finalY = gridEnabled ? Math.round(rawY / gridSize) * gridSize : rawY;
      const finalWidth = gridEnabled ? Math.round(rawWidth / gridSize) * gridSize : rawWidth;
      const finalHeight = gridEnabled ? Math.round(rawHeight / gridSize) * gridSize : rawHeight;

      dispatch(updateElement({
        id: e.target.name,
        changes: {
          x: finalX,
          y: finalY,
          rotation: e.target.angle || 0,
          width: finalWidth,
          height: finalHeight,
        }
      }));
      
      // Reset scale after updating absolute bounds to avoid compounding
      const finalProps = {
        left: finalX,
        top: finalY,
        width: finalWidth,
        height: finalHeight,
        scaleX: 1,
        scaleY: 1
      };

      if (e.target.type === 'ellipse') {
        e.target.set({
          ...finalProps,
          rx: finalWidth / 2,
          ry: finalHeight / 2,
        } as any);
      } else {
        e.target.set(finalProps);
      }
      setTimeout(() => isSyncingRef.current = false, 0);
    };

    const selectionHandler = (e: fabric.IEvent) => {
      const selected = fabricCanvas.getActiveObjects();
      dispatch(setSelectedElementIds(selected.map(obj => obj.name as string)));
    };

    const clearSelectionHandler = () => {
      dispatch(setSelectedElementIds([]));
    };

    const movingHandler = (e: fabric.IEvent) => {
      if (!gridEnabled || !e.target) return;
      
      e.target.set({
        left: Math.round(e.target.left! / gridSize) * gridSize,
        top: Math.round(e.target.top! / gridSize) * gridSize
      });
    };

    const scalingHandler = (e: fabric.IEvent) => {
        if (!gridEnabled || !e.target) return;
        
        // This is trickier as scaling affects width/height AND left/top
        // For now, let's just snap the resulting absolute bounds during movement
        // Fabric's internal scaling logic is complex to snap mid-scaling perfectly
        // but we can snap the final result in modifiedHandler easily.
    };

    fabricCanvas.on('object:moving', movingHandler);
    fabricCanvas.on('object:modified', modifiedHandler);
    fabricCanvas.on('selection:created', selectionHandler);
    fabricCanvas.on('selection:updated', selectionHandler);
    fabricCanvas.on('selection:cleared', clearSelectionHandler);

    return () => {
      fabricCanvas.off('object:moving', movingHandler);
      fabricCanvas.off('object:modified', modifiedHandler);
      fabricCanvas.off('selection:created', selectionHandler);
      fabricCanvas.off('selection:updated', selectionHandler);
      fabricCanvas.off('selection:cleared', clearSelectionHandler);
    };
  }, [fabricCanvas, dispatch, gridEnabled, gridSize]);

  return { fabricCanvas };
};
