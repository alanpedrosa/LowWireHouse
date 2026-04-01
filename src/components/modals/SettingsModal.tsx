import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setSettingsModalOpen } from '../../store/slices/uiSlice';
import { getApiKey, saveApiKey } from '../../utils/gemini';

export const SettingsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.ui.isSettingsModalOpen);
  const [apiKey, setApiKeyLocal] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKeyLocal(getApiKey());
      setIsSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveApiKey(apiKey);
    setIsSaved(true);
    setTimeout(() => {
      dispatch(setSettingsModalOpen(false));
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="panel w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-wire-border">
          <div className="flex items-center gap-2">
            <Key size={18} className="text-wire-dark" />
            <h3 className="label-panel mb-0">Configurações de IA</h3>
          </div>
          <button onClick={() => dispatch(setSettingsModalOpen(false))} className="btn-panel p-1 rounded-full border-none">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="label-panel" htmlFor="api-key">Gemini API Key</label>
            <div className="relative">
              <input 
                id="api-key"
                type="password" 
                className="input-panel pr-10" 
                placeholder="Insira sua chave de API aqui..."
                value={apiKey}
                onChange={(e) => setApiKeyLocal(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-wire-gray">
                <ShieldCheck size={16} />
              </div>
            </div>
            <p className="text-[10px] text-wire-gray flex items-start gap-1 mt-1 uppercase tracking-tight">
              <AlertCircle size={10} className="mt-0.5" />
              Sua chave é salva apenas no seu navegador localmente.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-3 bg-wire-light rounded border border-wire-border">
             <span className="text-xs font-semibold text-wire-dark uppercase">Onde conseguir?</span>
             <a 
               href="https://aistudio.google.com/app/apikey" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-wire-blue text-xs hover:underline flex items-center gap-1"
             >
               Clique aqui para gerar sua chave grátis no Google AI Studio
             </a>
          </div>
        </div>

        <div className="p-4 bg-wire-light/50 border-t border-wire-border flex justify-end gap-2">
          <button 
            onClick={() => dispatch(setSettingsModalOpen(false))} 
            className="btn-panel border border-wire-border"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave} 
            className={`btn-panel min-w-[100px] flex items-center justify-center gap-2 ${isSaved ? 'bg-green-500 border-green-500 text-white' : 'bg-wire-dark border-wire-dark text-white'}`}
          >
            {isSaved ? 'Salvo!' : 'Salvar Chave'}
          </button>
        </div>
      </div>
    </div>
  );
};
