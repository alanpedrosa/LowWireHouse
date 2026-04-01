import React from 'react';
import { Square, Circle, Type, Minus, Image as ImageIcon, MousePointer2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setActiveTool } from '../../store/slices/uiSlice';

interface ToolboxProps {
  className?: string;
}

export const Toolbox: React.FC<ToolboxProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const activeTool = useAppSelector(state => state.ui.activeTool);

  const tools = [
    { id: 'select', icon: <MousePointer2 size={24} strokeWidth={1.5} />, label: 'Select' },
    { id: 'rectangle', icon: <Square size={24} strokeWidth={1.5} />, label: 'Rect' },
    { id: 'ellipse', icon: <Circle size={24} strokeWidth={1.5} />, label: 'Ellipse' },
    { id: 'text', icon: <Type size={24} strokeWidth={1.5} />, label: 'Text' },
    { id: 'line', icon: <Minus size={24} strokeWidth={1.5} />, label: 'Line' },
    { id: 'image', icon: <ImageIcon size={24} strokeWidth={1.5} />, label: 'Image' },
  ] as const;

  return (
    <div className={`p-2 flex flex-col items-center gap-2 ${className || ''}`}>
      {tools.map(tool => (
        <button
          key={tool.id}
          className={`btn-tool ${activeTool === tool.id ? 'active' : ''}`}
          onClick={() => dispatch(setActiveTool(tool.id as any))}
          draggable={tool.id !== 'select'}
          onDragStart={(e) => {
            e.dataTransfer.setData('application/reactflow', tool.id);
            e.dataTransfer.effectAllowed = 'copy';
          }}
          title={tool.label}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
};
