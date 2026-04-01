import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { updateElement } from '../../store/slices/documentSlice';
import { WireframeElement } from '../../types/elements';

interface PropertiesPanelProps {
  className?: string;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const selectedIds = useAppSelector(state => state.ui.selectedElementIds);
  const allElements = useAppSelector(state => state.document.present.elements);

  const selectedElements = allElements.filter(el => selectedIds.includes(el.id));
  
  const handleUpdate = (id: string, changes: Partial<WireframeElement>) => {
    dispatch(updateElement({ id, changes }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof WireframeElement) => {
    if (selectedElements.length !== 1) return;
    const el = selectedElements[0];
    
    let value: string | number = e.target.value;
    if (e.target.type === 'number') {
      value = parseFloat(value);
      if (isNaN(value)) value = 0;
    }

    handleUpdate(el.id, { [field]: value });
  };

  return (
    <div className={`flex flex-col p-4 overflow-y-auto ${className || ''}`}>
      <h2 className="label-panel pb-2 border-b border-wire-border mb-4">Properties</h2>
      
      {selectedElements.length === 0 ? (
        <div className="flex-1 flex items-center justify-center flex-col text-wire-gray text-center p-4">
          <span className="text-sm">No element selected</span>
        </div>
      ) : selectedElements.length === 1 ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="label-panel">Dimensions</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-xs text-wire-gray mb-1">X</span>
                <input type="number" className="input-panel" value={Math.round(selectedElements[0].x)} onChange={(e) => handleChange(e, 'x')} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-wire-gray mb-1">Y</span>
                <input type="number" className="input-panel" value={Math.round(selectedElements[0].y)} onChange={(e) => handleChange(e, 'y')} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-wire-gray mb-1">W</span>
                <input type="number" className="input-panel" value={Math.round(selectedElements[0].width)} onChange={(e) => handleChange(e, 'width')} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-wire-gray mb-1">H</span>
                <input type="number" className="input-panel" value={Math.round(selectedElements[0].height)} onChange={(e) => handleChange(e, 'height')} />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="label-panel">Appearance</span>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-wire-gray">Fill</span>
                <div className="flex items-center gap-2">
                  <input type="color" className="w-6 h-6 p-0 border-0 rounded cursor-pointer" value={selectedElements[0].fill || '#000000'} onChange={(e) => handleChange(e, 'fill')} />
                  <input type="text" className="input-panel w-20 text-xs uppercase" value={selectedElements[0].fill || 'transparent'} onChange={(e) => handleChange(e, 'fill')} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-wire-gray">Stroke</span>
                <div className="flex items-center gap-2">
                  <input type="color" className="w-6 h-6 p-0 border-0 rounded cursor-pointer" value={selectedElements[0].stroke || '#000000'} onChange={(e) => handleChange(e, 'stroke')} />
                  <input type="text" className="input-panel w-20 text-xs uppercase" value={selectedElements[0].stroke || 'none'} onChange={(e) => handleChange(e, 'stroke')} />
                </div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-wire-gray">Border W.</span>
                <input type="number" className="input-panel w-20" value={selectedElements[0].strokeWidth || 0} onChange={(e) => handleChange(e, 'strokeWidth')} min="0" max="20" />
              </div>
            </div>
          </div>
          
          {selectedElements[0].type === 'text' && (
            <div className="flex flex-col gap-2 mt-2">
              <span className="label-panel">Typography</span>
              <textarea 
                className="input-panel min-h-[60px] resize-y" 
                value={(selectedElements[0] as any).text || ''} 
                onChange={(e) => handleUpdate(selectedElements[0].id, { text: e.target.value } as any)} 
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-wire-gray">Size</span>
                <input type="number" className="input-panel w-20" value={(selectedElements[0] as any).fontSize || 16} onChange={(e) => handleUpdate(selectedElements[0].id, { fontSize: parseInt(e.target.value) || 16 } as any)} min="8" max="144" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-wire-gray text-center p-4 text-sm">
          {selectedElements.length} elements selected
        </div>
      )}
    </div>
  );
};
