"use client";
import { LifeBuoy, Send, MessageSquare } from 'lucide-react';

export default function SupportPage() {
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

      <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
        <h3 className="text-white font-black uppercase text-sm mb-6 flex items-center gap-2">
          <Send size={16} className="text-blue-500" /> Transmit Priority Inquiry
        </h3>
        <form className="space-y-4">
          <input 
            type="text" 
            placeholder="Subject Line" 
            className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500/50" 
          />
          <textarea 
            placeholder="Describe the neural anomaly..." 
            className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500/50 min-h-[150px]"
          />
          <button className="w-full py-4 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
            Initiate Transmission
          </button>
        </form>
      </div>
    </div>
  );
}
