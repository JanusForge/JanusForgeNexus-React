"use client";
import { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export function NeuralLinkMonitor() {
  const [results, setResults] = useState<any[]>([]);
  const [pinging, setPinging] = useState(false);

  const runDiagnostics = async () => {
    setPinging(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/ping-council`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Diagnostic failed", err);
    } finally {
      setPinging(false);
    }
  };

  return (
    <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black uppercase italic text-white">Neural Link Monitor</h2>
        <button onClick={runDiagnostics} disabled={pinging} className="p-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all">
          <RefreshCw size={20} className={pinging ? "animate-spin" : ""} />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {results.map((ai) => (
          <div key={ai.name} className="p-4 rounded-2xl bg-black border border-white/5 text-center">
            <p className="text-[10px] font-black text-zinc-500 uppercase mb-2">{ai.name}</p>
            {ai.status === 'ONLINE' ? <CheckCircle className="text-green-500 mx-auto" /> : <XCircle className="text-red-500 mx-auto" />}
            <p className="text-[10px] font-bold mt-2">{ai.latency}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
