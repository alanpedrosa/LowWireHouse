import React from 'react';
import { Toolbox } from './components/toolbox/Toolbox';
import { TopToolbar } from './components/toolbar/TopToolbar';
import { PropertiesPanel } from './components/properties/PropertiesPanel';
import { CanvasArea } from './components/canvas/CanvasArea';
import { AIModal } from './components/modals/AIModal';
import { SettingsModal } from './components/modals/SettingsModal';

function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-wire-light text-wire-dark font-sans select-none">
      {/* Top Toolbar */}
      <TopToolbar className="h-14 border-b border-wire-border shrink-0 z-10" />

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Toolbox */}
        <Toolbox className="w-16 md:w-20 border-r border-wire-border flex flex-col shrink-0 bg-white z-10" />

        {/* Center Canvas */}
        <div className="flex-1 relative overflow-hidden bg-white">
          <CanvasArea />
        </div>

        {/* Right Properties Panel */}
        <PropertiesPanel className="w-64 border-l border-wire-border shrink-0 bg-white overflow-y-auto z-10" />
      </div>

      {/* Modals */}
      <AIModal />
      <SettingsModal />
    </div>
  );
}

export default App;
