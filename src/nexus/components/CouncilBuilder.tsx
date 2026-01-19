// src/nexus/components/CouncilBuilder.tsx (Surgically Aligned)

import React from 'react';

interface Props {
  selectedModels: string[];
  setSelectedModels: React.Dispatch<React.SetStateAction<string[]>>;
  userBalance: number;
  onIgnite: () => void;
}

export default function CouncilBuilder({ selectedModels, setSelectedModels, onIgnite }: Props) {
  const models = [
    { id: 'CLAUDE', name: 'Claude 3.5 Sonnet' },
    { id: 'GPT4', name: 'GPT-4o' },
    { id: 'GEMINI', name: 'Gemini 1.5 Pro' },
    { id: 'GROK', name: 'Grok-Beta' },
    { id: 'DEEPSEEK', name: 'DeepSeek-V3' }
  ];

  const toggleModel = (id: string) => {
    setSelectedModels(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap gap-3">
        {models.map(model => (
          <button
            key={model.id}
            onClick={() => toggleModel(model.id)}
            className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
              selectedModels.includes(model.id) 
                ? 'bg-indigo-600 border-indigo-500 text-white' 
                : 'bg-white/5 border-white/10 text-zinc-500'
            }`}
          >
            {model.name}
          </button>
        ))}
      </div>
    </div>
  );
}
