import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface IgnitionProps {
  user: {
    id: string;
    email: string;
    tokens_remaining: number;
  };
  currentPrompt: string;
  updateTokens: (newCount: number) => void;
}

const NexusIgnitionChamber: React.FC<IgnitionProps> = ({ user, currentPrompt, updateTokens }) => {
  const router = useRouter();
  const [isIgniting, setIsIgniting] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>(['CLAUDE', 'GPT4', 'GEMINI', 'GROK', 'DEEPSEEK']);
  
  const COST_PER_MODEL = 5;
  const totalCost = selectedModels.length * COST_PER_MODEL;
  
  // 🛡️ Master Authority Check [cite: 2025-11-27]
  const isMaster = user.email.toLowerCase() === 'admin@janusforge.ai' || user.tokens_remaining >= 999000;

  const models = [
    { id: 'CLAUDE', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
    { id: 'GPT4', name: 'GPT-4o', provider: 'OpenAI' },
    { id: 'GEMINI', name: 'Gemini 1.5 Pro', provider: 'Google' },
    { id: 'GROK', name: 'Grok-2', provider: 'xAI' },
    { id: 'DEEPSEEK', name: 'DeepSeek-V3', provider: 'DeepSeek' }
  ];

  const toggleModel = (id: string) => {
    setSelectedModels(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const igniteSynthesis = async () => {
    if (selectedModels.length < 2) return;
    setIsIgniting(true);

    try {
      const response = await fetch('https://janusforgenexus-backend.onrender.com/api/nexus/synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt,
          userId: user.id,
          selectedModels
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Ignition sequence failed');

      // Update UI balance - Admins keep their master balance [cite: 2025-11-27]
      updateTokens(data.tokens_remaining);

      // Transition to the synthesis chamber
      router.push(`/nexus/chamber/${data.conversationId}`);

    } catch (err: any) {
      console.error("🌌 Nexus Critical Error:", err.message);
      alert(err.message);
      setIsIgniting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* --- 1. VALUE PROPOSITION BANNER --- */}
      <div className="bg-gradient-to-br from-blue-900/40 to-black p-6 rounded-2xl border border-blue-500/30 shadow-xl text-center">
        <h2 className="text-2xl font-bold text-blue-400 mb-2 tracking-tight">FRONTIER INTELLIGENCE MARKETPLACE</h2>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Nexus Prime conducts simultaneous adversarial reasoning. Select your Council of experts. 
          Consensus-driven truth costs **5 Tokens per model**.
        </p>
      </div>

      {/* --- 2. THE COUNCIL BUILDER --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map(model => (
          <button
            key={model.id}
            onClick={() => toggleModel(model.id)}
            className={`p-4 rounded-xl border transition-all text-left group ${
              selectedModels.includes(model.id)
                ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                : 'bg-gray-900/50 border-gray-800 opacity-60'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                selectedModels.includes(model.id) ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-500'
              }`}>
                {model.provider}
              </span>
              <span className="text-blue-400 font-mono text-xs">5🪙</span>
            </div>
            <p className="font-bold text-white group-hover:text-blue-300 transition-colors">{model.name}</p>
          </button>
        ))}
      </div>

      {/* --- 3. THE IGNITION SCANNER --- */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Compute Credit Impact</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-mono font-bold text-white">{totalCost}</span>
              <span className="text-blue-500 text-lg font-bold mb-1">TOKENS</span>
            </div>
          </div>

          <button
            disabled={selectedModels.length < 2 || isIgniting}
            onClick={igniteSynthesis}
            className={`px-12 py-4 rounded-xl font-black text-xl tracking-tighter transition-all transform hover:scale-105 active:scale-95 ${
              selectedModels.length < 2 
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:bg-blue-500'
            }`}
          >
            {isIgniting ? 'IGNITING...' : isMaster ? 'MASTER IGNITION' : 'IGNITE COUNCIL'}
          </button>
        </div>

        {/* Master Key Indicator [cite: 2025-11-27] */}
        {isMaster && (
          <div className="mt-4 py-2 border-t border-blue-900/50 text-center">
            <p className="text-[10px] text-blue-500/80 tracking-[0.3em] font-bold uppercase">
              Master Authority Active: Unrestricted Frontier Access
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NexusIgnitionChamber;
