"use client";
import { useState } from 'react';
import { Radio, Send, Loader2 } from 'lucide-react';

const MASTER_ID = '550e8400-e29b-41d4-a716-446655440000';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export function BroadcastCommand() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/broadcast`, {
        method: 'POST',
        headers: {
          'x-user-id': MASTER_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      if (res.ok) {
        setStatus("TRANSMISSION SUCCESSFUL");
        setMessage('');
        setTimeout(() => setStatus(null), 3000);
      }
    } catch (err) {
      setStatus("LINK FAILURE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] shadow-2xl">
      <h3 className="text-xl font-black uppercase italic text-white flex items-center gap-2 mb-6">
        <Radio className="text-indigo-500 animate-pulse" size={20} />
        Nexus Broadcast
      </h3>
      
      <form onSubmit={handleBroadcast} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter global protocol message..."
          className="w-full bg-black border border-white/5 rounded-2xl p-4 text-sm text-zinc-300 outline-none focus:border-indigo-500/50 min-h-[100px] resize-none"
        />
        
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {status || "Target: All Connected Nodes"}
          </span>
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
            Transmit
          </button>
        </div>
      </form>
    </div>
  );
}
