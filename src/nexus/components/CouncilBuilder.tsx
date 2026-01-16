"use client";

import React from 'react';

// 🛡️ THE INTERFACE LOCK (Must match the Engine's props)
interface CouncilBuilderProps {
  userBalance: number;
  onIgnite: (modelsToUse?: string[]) => Promise<void>;
  selectedModels: string[];
  setSelectedModels: React.Dispatch<React.SetStateAction<string[]>>;
}

const CouncilBuilder: React.FC<CouncilBuilderProps> = ({ 
  userBalance, 
  onIgnite, 
  selectedModels, 
  setSelectedModels 
}) => {
  const COST_PER_MODEL = 5;
  const totalCost = selectedModels.length * COST_PER_MODEL;
  const isMaster = userBalance >= 999000;

  const models = [
    { id: 'CLAUDE', name: 'Claude 4.5', provider: 'Anthropic' },
    { id: 'GPT4', name: 'GPT-5.2', provider: 'OpenAI' },
    { id: 'GEMINI', name: 'Gemini 3 Pro', provider: 'Google' },
    { id: 'GROK', name: 'Grok 4.1', provider: 'xAI' },
    { id: 'DEEPSEEK', name: 'DeepSeek V3.2', provider: 'DeepSeek' }
  ];

  const toggleModel = (id: string) => {
    setSelectedModels(prev =>
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 shadow-inner">
        <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-6 text-center">
          Adjust Council Cluster
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {models.map(model => (
            <button
              key={model.id}
              type="button"
              onClick={() => toggleModel(model.id)}
              className={`flex flex-col p-4 rounded-xl border transition-all text-left ${
                selectedModels.includes(model.id)
                  ? 'bg-indigo-600/10 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                  : 'bg-black/20 border-white/5 text-zinc-600 grayscale'
              }`}
            >
              <span className="text-[8px] font-bold uppercase opacity-60 tracking-widest">{model.provider}</span>
              <span className="font-bold text-sm">{model.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-white/5">
          <div className="flex justify-between items-center gap-4 mb-8">
            <div className="text-left">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Compute Impact</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-mono font-bold text-white tracking-tighter">{totalCost}</span>
                <span className="text-indigo-500 font-black text-sm">TOKENS</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Available</span>
              <p className="text-xl font-mono text-white tracking-tight">
                {isMaster ? 'UNRESTRICTED' : userBalance.toLocaleString()} 🪙
              </p>
            </div>
          </div>

          <button
            onClick={() => onIgnite(selectedModels)}
            disabled={selectedModels.length < 2}
            className={`w-full py-5 rounded-2xl font-black text-xl tracking-tighter transition-all transform active:scale-95 ${
              selectedModels.length < 2
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_40px_rgba(79,70,229,0.4)] border border-indigo-400/50'
            }`}
          >
            {isMaster ? "IGNITE MASTER SYNTHESIS" : "IGNITE COUNCIL SYNTHESIS"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouncilBuilder;
