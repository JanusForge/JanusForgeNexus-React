"use client";
import { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, Activity } from 'lucide-react';

const MASTER_ID = '550e8400-e29b-41d4-a716-446655440000';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export function NeuralLinkMonitor() {
  const [results, setResults] = useState<any[]>([]);
  const [pinging, setPinging] = useState(false);
  const [systemStatus, setSystemStatus] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setPinging(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/ping-council`, {
        method: 'GET',
        headers: {
          'x-user-id': MASTER_ID,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      
      const data = await res.json();
      // Backend returns { systemStatus, results, avgLatency }
      setResults(data.results || []);
      setSystemStatus(data.systemStatus);
    } catch (err) {
      console.error("Diagnostic failed", err);
    } finally {
      setPinging(false);
    }
  };

  return (
    <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] shadow-2xl transition-all hover:border-blue-500/20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black uppercase italic text-white flex items-center gap-2">
            <Activity className="text-blue-500" size={20} />
            Council Heartbeat
          </h2>
          {systemStatus && (
            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
              systemStatus === 'HEALTHY' ? 'text-green-500' : 'text-amber-500'
            }`}>
              System {systemStatus}
            </p>
          )}
        </div>
        <button 
          onClick={runDiagnostics} 
          disabled={pinging} 
          className="p-4 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <RefreshCw size={20} className={`text-white ${pinging ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {results.length > 0 ? (
          results.map((ai) => (
            <div key={ai.name} className="p-5 rounded-3xl bg-black border border-white/5 flex flex-col items-center justify-center space-y-3">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{ai.name}</p>
              {ai.status === 'ONLINE' ? (
                <CheckCircle className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" size={24} />
              ) : (
                <XCircle className="text-red-500" size={24} />
              )}
              <p className="text-[10px] font-mono font-bold text-zinc-400">
                {ai.status === 'ONLINE' ? ai.latency : 'OFFLINE'}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full py-10 text-center">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Diagnostic Command...</p>
          </div>
        )}
      </div>
    </div>
  );
}
