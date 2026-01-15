import React, { useState } from 'react';

// 1. Define Props Interface to fix the Vercel Build Error
interface CouncilBuilderProps {
  userBalance: number;
  onIgnite: (selectedModels: string[]) => void;
}

const CouncilBuilder: React.FC<CouncilBuilderProps> = ({ userBalance, onIgnite }) => {
  // Council State
  const [selectedModels, setSelectedModels] = useState<string[]>([
    'CLAUDE', 'GPT4', 'GEMINI', 'GROK', 'DEEPSEEK'
  ]);

  const COST_PER_MODEL = 5;
  const totalCost = selectedModels.length * COST_PER_MODEL;

  // Site Owner check for Admin@janusforge.ai
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
      {/* 1. THE VALUE BANNER */}
      <section className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6 rounded-2xl border border-blue-500/30 shadow-lg">
        <h2 className="text-2xl font-bold text-blue-400 mb-2 tracking-tight">🌌 Frontier Intelligence Marketplace</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Nexus Prime orchestrates a simultaneous adversarial showdown between world-class models. 
          Each model identifies flaws in the others' logic to deliver a high-consensus synthesis.
        </p>
      </section>

      {/* 2. THE PRICE TABLE (Visual Value Proposition) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 transition-hover hover:border-blue-500/50">
          <p className="text-blue-400 font-bold uppercase text-xs tracking-widest">Dueling Pair</p>
          <p className="text-2xl font-mono mt-1 text-white">10 🪙</p>
          <p className="text-[10px] text-gray-500 mt-1 uppercase">Logic Verification</p>
        </div>
        <div className="p-4 bg-blue-600/10 rounded-xl border border-blue-500 scale-105 shadow-2xl z-10">
          <p className="text-blue-400 font-bold uppercase text-xs tracking-widest">Strategic Trio</p>
          <p className="text-2xl font-mono mt-1 text-white">15 🪙</p>
          <p className="text-[10px] text-blue-300 mt-1 uppercase font-bold">Diverse Cluster Analysis</p>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 transition-hover hover:border-blue-500/50">
          <p className="text-blue-400 font-bold uppercase text-xs tracking-widest">Frontier Council</p>
          <p className="text-2xl font-mono mt-1 text-white">25 🪙</p>
          <p className="text-[10px] text-gray-500 mt-1 uppercase">Full 5-AI Consensus</p>
        </div>
      </div>

      {/* 3. MODEL SELECTION GRID */}
      <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-inner">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 text-center">Select Council Members</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {models.map(model => (
            <button
              key={model.id}
              onClick={() => toggleModel(model.id)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                selectedModels.includes(model.id)
                  ? 'bg-blue-600/10 border-blue-500 text-white ring-1 ring-blue-500/50'
                  : 'bg-black/20 border-gray-800 text-gray-500 grayscale'
              }`}
            >
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{model.provider}</p>
                <p className="font-bold">{model.name}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                selectedModels.includes(model.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-700'
              }`}>
                {selectedModels.includes(model.id) && <span className="text-xs">✓</span>}
              </div>
            </button>
          ))}
        </div>

        {/* THE IMPACT SCANNER (The "Transaction Preview") */}
        <div className="mt-8 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="text-center sm:text-left">
              <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Compute Credit Impact</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-mono font-bold text-white tracking-tighter">{totalCost}</span>
                <span className="text-blue-500 font-black text-sm">TOKENS</span>
              </div>
            </div>
            
            <div className="text-center sm:text-right">
              <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Your Current Balance</span>
              <p className="text-xl font-mono text-white tracking-tight">
                {isMaster ? '999,789' : userBalance.toLocaleString()} 🪙
              </p>
            </div>
          </div>

          <button
            onClick={() => onIgnite(selectedModels)}
            disabled={selectedModels.length < 2}
            className={`w-full py-5 rounded-2xl font-black text-xl tracking-tighter transition-all transform active:scale-95 ${
              selectedModels.length < 2 
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] border border-blue-400/50'
            }`}
          >
            {isMaster ? "IGNITE MASTER SYNTHESIS" : "IGNITE COUNCIL SYNTHESIS"}
          </button>

          {isMaster && (
            <p className="text-center text-[10px] text-blue-500/60 mt-4 uppercase tracking-[0.4em] font-bold">
              Master Authority Active: Unrestricted Frontier Compute
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouncilBuilder;
