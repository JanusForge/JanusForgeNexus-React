// src/nexus/components/CouncilBuilder.tsx (Surgically Aligned to 2026 Backend)

import React from 'react';

interface Props {
  selectedModels: string[];
  setSelectedModels: React.Dispatch<React.SetStateAction<string[]>>;
  userBalance: number;
  onIgnite: () => void;
}

export default function CouncilBuilder({ selectedModels, setSelectedModels }: Props) {
  // --- 🏛️ THE PENTARCHY (2026 EDITIONS) ---
  const models = [
    { id: 'CLAUDE', name: 'Claude 3.7 Sonnet', detail: 'Reasoning' },
    { id: 'GPT4', name: 'GPT-5.2 Pro', detail: 'Logic' },
    { id: 'GEMINI', name: 'Gemini 3.0 Pro', detail: 'Multimodal' },
    { id: 'GROK', name: 'Grok-3', detail: 'Real-time' },
    { id: 'DEEPSEEK', name: 'DeepSeek-V3', detail: 'Synthesis' }
  ];

  const toggleModel = (id: string) => {
    setSelectedModels(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/60 mb-2">
          Council Configuration ({selectedModels.length}/5)
        </h4>
        <div className="flex flex-wrap gap-3">
          {models.map(model => (
            <button
              key={model.id}
              onClick={() => toggleModel(model.id)}
              className={`relative px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
                selectedModels.includes(model.id)
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                  : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col items-start gap-1">
                <span>{model.name}</span>
                <span className={`text-[7px] lowercase tracking-normal opacity-50 ${
                  selectedModels.includes(model.id) ? 'text-indigo-200' : 'text-zinc-600'
                }`}>
                  {model.detail}
                </span>
              </div>
              
              {selectedModels.includes(model.id) && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(129,140,248,1)]" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {selectedModels.length === 0 && (
        <p className="text-[9px] text-amber-500/60 uppercase tracking-widest italic animate-pulse">
          ⚠️ At least one Council member must be active for Ignition.
        </p>
      )}
    </div>
  );
}
