import React from 'react';
import { Undo2, Redo2, Download, LogOut, Grid3X3, Save, Sparkles, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ActionCreators } from 'redux-undo';
import { setGridEnabled } from '../../store/slices/documentSlice';
import { setAIModalOpen, setSettingsModalOpen } from '../../store/slices/uiSlice';

interface TopToolbarProps {
  className?: string;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const pastLength = useAppSelector(state => state.document.past.length);
  const futureLength = useAppSelector(state => state.document.future.length);

  const elements = useAppSelector(state => state.document.present.elements);
  const gridEnabled = useAppSelector(state => state.document.present.gridEnabled);
  const gridSize = useAppSelector(state => state.document.present.gridSize);

  const handleSave = () => {
    const data = {
      version: '1.0',
      document: {
        elements,
        gridEnabled,
        gridSize
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wireframe-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    window.dispatchEvent(new CustomEvent('export-canvas-png'));
  };

  return (
    <div className={`flex items-center justify-between px-4 bg-white ${className || ''}`}>
      <div className="flex items-center gap-4">
        <h1 className="font-mono font-bold text-lg tracking-tight">LowWireHouse</h1>
        
        <div className="h-6 w-px bg-wire-border mx-2"></div>
        
        <div className="flex items-center gap-1">
          <button 
            className="btn-panel disabled:opacity-30 disabled:hover:bg-transparent"
            onClick={() => dispatch(ActionCreators.undo())}
            disabled={pastLength === 0}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={18} />
          </button>
          <button 
            className="btn-panel disabled:opacity-30 disabled:hover:bg-transparent"
            onClick={() => dispatch(ActionCreators.redo())}
            disabled={futureLength === 0}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          className={`btn-panel ${gridEnabled ? 'bg-wire-blue/10 text-wire-blue border-wire-blue' : ''}`} 
          onClick={() => dispatch(setGridEnabled(!gridEnabled))}
          title="Toggle Grid"
        >
          <Grid3X3 size={18} />
        </button>
        <div className="h-6 w-px bg-wire-border mx-2"></div>
         <button 
          className="btn-panel flex gap-2 text-sm font-semibold border" 
          title="Save JSON"
          onClick={handleSave}
        >
          <Save size={16} /> Save
        </button>
        <button 
          className="btn-panel flex gap-2 text-sm font-semibold border border-wire-blue bg-wire-blue text-white hover:bg-blue-600" 
          title="Magic Build (AI)"
          onClick={() => dispatch(setAIModalOpen(true))}
        >
          <Sparkles size={16} /> IA
        </button>
        <button 
          className="btn-panel flex gap-2 text-sm font-semibold border" 
          title="Settings"
          onClick={() => dispatch(setSettingsModalOpen(true))}
        >
          <Settings size={16} />
        </button>
        <div className="h-6 w-px bg-wire-border mx-1"></div>
        <button 
          className="btn-panel flex gap-2 text-sm font-semibold border border-wire-dark bg-wire-dark text-white hover:bg-black hover:text-white active:bg-gray-800" 
          title="Export PNG"
          onClick={handleExport}
        >
          <Download size={16} /> Export
        </button>
      </div>
    </div>
  );
};
