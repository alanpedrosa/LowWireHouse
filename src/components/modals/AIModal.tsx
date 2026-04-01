import React, { useState } from 'react';
import { X, Sparkles, Wand2, Info, Loader2, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setAIModalOpen, setSettingsModalOpen } from '../../store/slices/uiSlice';
import { setDocumentState } from '../../store/slices/documentSlice';
import { generateWireframe, getApiKey } from '../../utils/gemini';

export const AIModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(state => state.ui.isAIModalOpen);
  const docState = useAppSelector(state => state.document.present);
  
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setError('Por favor, configure sua Gemini API Key primeiro.');
      return;
    }

    if (!prompt.trim()) {
      setError('Digite uma descrição para o wireframe.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateWireframe(prompt, apiKey);
      if (result && Array.isArray(result)) {
        // Apply the new state
        dispatch(setDocumentState({
          ...docState,
          elements: result
        }));
        // Close modal on success
        dispatch(setAIModalOpen(false));
        setPrompt('');
      } else {
        throw new Error('Resposta inválida da IA.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao gerar o wireframe.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="panel w-full max-w-lg animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-wire-border">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-wire-blue" />
            <h3 className="label-panel mb-0">Gerar com IA</h3>
          </div>
          <button onClick={() => dispatch(setAIModalOpen(false))} className="btn-panel p-1 rounded-full border-none">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="label-panel" htmlFor="ai-prompt">Descrição da Interface</label>
            <textarea 
              id="ai-prompt"
              className="input-panel min-h-[120px] resize-none text-base p-3 leading-relaxed" 
              placeholder="Ex: Uma tela de dashboard financeiro com 3 cards de totais no topo, um gráfico de linha no centro e uma tabela de transações recentes abaixo..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs animate-in slide-in-from-top-2">
              <AlertCircle size={14} className="mt-0.5" />
              <div className="flex flex-col gap-1">
                <span>{error}</span>
                {error.includes('Key') && (
                   <button 
                     onClick={() => {
                       dispatch(setAIModalOpen(false));
                       dispatch(setSettingsModalOpen(true));
                     }}
                     className="font-bold underline text-left"
                   >
                     Ir para Configurações
                   </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded text-blue-700 text-[10px] uppercase tracking-wider font-semibold">
            <Info size={14} className="mt-0.5" />
            <span>A IA substituirá todo o conteúdo atual do canvas.</span>
          </div>
        </div>

        <div className="p-4 bg-wire-light/50 border-t border-wire-border flex justify-end gap-2">
          <button 
            onClick={() => dispatch(setAIModalOpen(false))} 
            className="btn-panel border border-wire-border px-6"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            onClick={handleGenerate} 
            disabled={isLoading}
            className="btn-panel bg-wire-dark border-wire-dark text-white px-8 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Wand2 size={18} />
                Gerar Wireframe
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
