"use client";

import {
  Search, Globe, ChevronRight, Loader2,
  Rss, Printer, Save, Share2, MessageSquare, Volume2, Square, Mail, CheckCircle2, History, Zap, X
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import jsPDF from 'jspdf';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function DailyForgePage() {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [loading, setLoading] = useState(true);
  const [isReading, setIsReading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [syncingSubscription, setSyncingSubscription] = useState(false);
  const [interjection, setInterjection] = useState("");
  const [sendingInterjection, setSendingInterjection] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false); // ✨ New State

  useEffect(() => {
    fetchDailyForge();
    fetchHistory();
    if (user) setIsSubscribed((user as any).digest_subscribed ?? true);
  }, [user]);

  // --- 🎙️ restored AI VOICE LOGIC ---
  const handleReadAloud = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }
    const thoughts = Array.isArray(data.openingThoughts) ? data.openingThoughts : JSON.parse(data.openingThoughts || "[]");
    const fullText = thoughts.map((t: any) => `${t.model} perspective: ${t.content}`).join(". Next. ");
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    window.speechSynthesis.speak(utterance);
  };

  // --- 🖨️ PRINT LOGIC ---
  const handlePrint = () => {
    window.print(); // Simple and effective for browsers
  };

  // --- 📄 PDF LOGIC (RESTORED/KEPT) ---
  const handleSavePDF = () => {
    if (!data) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("JANUS FORGE: DAILY SYNTHESIS", 20, 20);
    doc.setFontSize(10);
    doc.text(`Topic: ${data.winningTopic}`, 20, 30);
    doc.save(`JanusForge_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  async function fetchDailyForge() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/daily-forge`, { cache: 'no-store' });
      const json = await response.json();
      setData(json);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  async function fetchHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/daily-forge/history`);
      if (response.ok) setHistory(await response.json());
    } catch (err) { console.error(err); }
  }

  const handleInterjection = async () => {
    if (!interjection.trim() || sendingInterjection) return;
    setSendingInterjection(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/daily-forge/interject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, content: interjection })
      });
      const result = await response.json();
      if (response.ok) {
        const userDirective = { model: "ARCHITECT", content: interjection, isUser: true };
        const aiReaction = { model: "CLAUDE (OPUS 4.5)", content: result.aiResponse };
        setData((prev: any) => ({
          ...prev,
          openingThoughts: [userDirective, aiReaction, ...prev.openingThoughts]
        }));
        setInterjection("");
      }
    } catch (err) { console.error(err); } finally { setSendingInterjection(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-500" size={48} />
      <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs">Querying Nexus Intelligence...</p>
    </div>
  );

  const thoughts = data ? (Array.isArray(data.openingThoughts) ? data.openingThoughts : JSON.parse(data.openingThoughts || "[]")) : [];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 pb-24">
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
          <div className="bg-gray-900 border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full space-y-6 relative">
            <button onClick={() => setShowShareModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X size={20}/></button>
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Distribute Synthesis</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'X / Twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.winningTopic)}&url=https://janusforge.ai` },
                { name: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=https://janusforge.ai` },
                { name: 'Reddit', url: `https://www.reddit.com/submit?title=${encodeURIComponent(data.winningTopic)}&url=https://janusforge.ai` },
                { name: 'Email', url: `mailto:?subject=Janus Forge Synthesis&body=Check out today's debate: https://janusforge.ai` }
              ].map(site => (
                <a key={site.name} href={site.url} target="_blank" className="p-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase text-center hover:bg-blue-500 hover:text-black transition-all">
                  {site.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent uppercase">The Daily <span className="text-blue-500">Forge</span></h1>
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => setActiveTab('active')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${activeTab === 'active' ? 'bg-blue-500 border-blue-500 text-black shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'border-white/10 text-gray-500'}`}>Active Synthesis</button>
          <button onClick={() => setActiveTab('history')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${activeTab === 'history' ? 'bg-purple-500 border-purple-500 text-black shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'border-white/10 text-gray-500'}`}>The Archives</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {activeTab === 'active' ? (
          <div className="space-y-24">
            <section className="bg-gradient-to-b from-blue-600/10 to-transparent border border-blue-500/20 p-8 md:p-12 rounded-[3.5rem] shadow-[0_0_80px_rgba(37,99,235,0.1)]">
              <div className="text-center mb-16">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] block mb-4">Winning Thesis</span>
                <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-tight">{data.winningTopic}</h2>
              </div>

              <div className="space-y-16 mb-16">
                {thoughts.map((thought: any, i: number) => (
                  <div key={i} className={`relative pl-12 border-l ${thought.isUser ? 'border-white bg-white/5 p-6 rounded-r-3xl' : 'border-blue-500/20'} animate-in fade-in slide-in-from-left-4 duration-700`}>
                    <div className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full ${thought.isUser ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]' : 'bg-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.6)]'}`}></div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] block mb-4 ${thought.isUser ? 'text-white' : 'text-blue-400'}`}>
                      {thought.model === "ARCHITECT" ? `DIRECTIVE FROM ARCHITECT ${user?.username || ''}` : `${thought.model} Internal Logic`}
                    </span>
                    <div className={`${thought.isUser ? 'text-white font-bold italic' : 'text-gray-300 font-medium'} text-base leading-relaxed whitespace-pre-wrap`}>{thought.content}</div>
                  </div>
                ))}
              </div>

              {/* Interjection Zone */}
              <div className="pt-12 border-t border-white/5">
                {isAuthenticated && (user as any).tokens_remaining > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between"><span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><Zap size={12}/> Architect Interjection</span><span className="text-[10px] font-bold text-gray-500">{(user as any).tokens_remaining} Tokens Avail.</span></div>
                    <textarea value={interjection} onChange={(e) => setInterjection(e.target.value)} placeholder="Insert directive..." className="w-full bg-black/40 border border-white/10 p-6 rounded-[2rem] text-sm text-white focus:border-blue-500 h-32 resize-none" />
                    <button onClick={handleInterjection} disabled={sendingInterjection || !interjection.trim()} className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-3">
                      {sendingInterjection ? <Loader2 className="animate-spin" size={16}/> : <><MessageSquare size={16}/> Transmit Directive</>}
                    </button>
                  </div>
                ) : <div className="text-center p-12 border border-dashed border-white/5 rounded-[2.5rem] text-gray-600 font-bold italic">Insufficient tokens for Council Interjection.</div>}
              </div>

              {/* Utility Bar */}
              <div className="flex flex-wrap justify-center gap-8 mt-12 text-gray-500 border-t border-white/5 pt-10">
                <button onClick={handleReadAloud} className={`flex items-center gap-2 text-[10px] font-black uppercase transition-all ${isReading ? 'text-red-500' : 'hover:text-white'}`}>
                  {isReading ? <Square size={14} fill="currentColor"/> : <Volume2 size={14}/>} Read Aloud
                </button>
                <button onClick={handlePrint} className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-white transition-colors"><Printer size={14}/> Print</button>
                <button onClick={handleSavePDF} className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-white transition-colors"><Save size={14}/> Save PDF</button>
                <button onClick={() => setShowShareModal(true)} className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-white transition-colors"><Share2 size={14}/> Share</button>
              </div>
            </section>
          </div>
        ) : (
          <section className="grid gap-6">
            {history.length > 0 ? history.map((entry: any) => (
              <div key={entry.id} className="p-8 bg-gray-900/30 border border-white/5 rounded-[2.5rem] hover:border-purple-500/30 group">
                <div className="flex justify-between items-start mb-4"><span className="text-[10px] font-black text-gray-600 uppercase">{new Date(entry.date).toLocaleDateString()}</span></div>
                <h3 className="text-xl font-black uppercase italic text-white group-hover:text-purple-400 transition-colors">{entry.winningTopic}</h3>
              </div>
            )) : <p className="text-center text-gray-600 italic py-24">The Archives are currently empty.</p>}
          </section>
        )}
      </div>
    </div>
  );
}
