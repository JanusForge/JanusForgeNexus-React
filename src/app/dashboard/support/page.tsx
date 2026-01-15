"use client";
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { LifeBuoy, Send, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';

export default function SupportPage() {
  const { user } = useAuth(); //
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Link to your Render backend
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

  const handleTransmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    setIsSending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/support/transmit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id, //
          subject,
          message,
        }),
      });

      if (response.ok) {
        setSent(true);
        setSubject('');
        setMessage('');
        // Reset success message after 5 seconds
        setTimeout(() => setSent(false), 5000);
      }
    } catch (error) {
      console.error("Transmission Interrupted:", error);
      alert("Neural Link Failure: Could not reach the Architects.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-white uppercase italic mb-2 tracking-tighter">Nexus Support</h1>
      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-12">Establish a direct link to the architects</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-[2rem] text-center">
          <MessageSquare className="mx-auto text-blue-500 mb-4" size={32} />
          <h3 className="text-white font-black uppercase text-xs mb-2">Knowledge Base</h3>
          <p className="text-zinc-500 text-[10px]">Access the Forge Protocols</p>
        </div>
        <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-[2rem] text-center">
          <LifeBuoy className="mx-auto text-indigo-500 mb-4" size={32} />
          <h3 className="text-white font-black uppercase text-xs mb-2">Live Status</h3>
          <p className="text-zinc-500 text-[10px]">View Council Heartbeat</p>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden">
        {sent && (
          <div className="absolute inset-0 bg-blue-600/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-in zoom-in duration-300">
            <CheckCircle2 size={48} className="text-white mb-4" />
            <h3 className="text-white font-black uppercase text-xl">Transmission Received</h3>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-2">The Architects have been notified.</p>
          </div>
        )}

        <h3 className="text-white font-black uppercase text-sm mb-6 flex items-center gap-2">
          <Send size={16} className="text-blue-500" /> Initiate Priority Inquiry
        </h3>
        
        <form onSubmit={handleTransmit} className="space-y-4">
          <input 
            type="text" 
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject Line" 
            className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500/50" 
          />
          <textarea 
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the neural anomaly..." 
            className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500/50 min-h-[150px]"
          />
          <button 
            type="submit"
            disabled={isSending}
            className="w-full py-4 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3"
          >
            {isSending ? (
              <><Loader2 className="animate-spin" size={16} /> Encrypting Transmission...</>
            ) : (
              "Initiate Transmission"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
