"use client";

import {
  Search, Globe, ChevronRight, Loader2,
  Rss, Printer, Save, Share2, MessageSquare, Volume2, Square, Mail, CheckCircle2, History, Zap
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import jsPDF from 'jspdf'; // ✨ New Import

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

  useEffect(() => {
    fetchDailyForge();
    fetchHistory();
    if (user) setIsSubscribed((user as any).digest_subscribed ?? true);
  }, [user]);

  // --- ✨ PDF GENERATION LOGIC ---
  const handleSavePDF = () => {
    if (!data) return;
    const doc = new jsPDF();
    const thoughts = Array.isArray(data.openingThoughts) ? data.openingThoughts : JSON.parse(data.openingThoughts || "[]");
    
    // Styling
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("JANUS FORGE: DAILY SYNTHESIS", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, 20, 30);
    
    doc.setDrawColor(0, 102, 204);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("WINNING THESIS:", 20, 50);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    const splitTopic = doc.splitTextToSize(data.winningTopic.toUpperCase(), 160);
    doc.text(splitTopic, 20, 60);

    let yOffset = 80;

    thoughts.forEach((thought: any) => {
      if (yOffset > 250) { doc.addPage(); yOffset = 20; }
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(thought.isUser ? 0 : 59, 130, 246);
      doc.text(`${thought.model} LOGIC:`, 20, yOffset);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50);
      const content = doc.splitTextToSize(thought.content, 160);
      doc.text(content, 20, yOffset + 7);
      yOffset += (content.length * 7) + 15;
    });

    doc.save(`JanusForge_${new Date(data.date).toISOString().split('T')[0]}.pdf`);
  };

  // ... (Keep existing fetchDailyForge, fetchHistory, handleInterjection, handleReadAloud, toggleSubscription)

  async function fetchDailyForge() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/daily-forge`, { cache: 'no-store' });
      if (!response.ok) throw new Error("Forge data unavailable");
      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error("Failed to load real-time forge data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/daily-forge/history`);
      if (response.ok) {
        const json = await response.json();
        setHistory(json);
      }
    } catch (err) {
      console.error("Archive fetch failed:", err);
    }
  }

  const handleInterjection = async () => {
    if (!interjection.trim() || sendingInterjection) return;
    setSendingInterjection(true);
    const directiveText = interjection;
    try {
      const response = await fetch(`${API_BASE_URL}/api/daily-forge/interject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, content: directiveText })
      });
      const result = await response.json();
      if (response.ok) {
        setInterjection("");
        const userDirective = { model: "ARCHITECT", content: directiveText, isUser: true };
        const aiReaction = { model: "CLAUDE (OPUS 4.5)", content: result.aiResponse };
        setData((prev: any) => ({
          ...prev,
          openingThoughts: Array.isArray(prev.openingThoughts) ? [userDirective, aiReaction, ...prev.openingThoughts] : JSON.stringify([userDirective, aiReaction, ...JSON.parse(prev.openingThoughts || "[]")])
        }));
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
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent uppercase text-shadow-glow">
          The Daily <span className="text-blue-500">Forge</span>
        </h1>
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => setActiveTab('active')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === 'active' ? 'bg-blue-500 border-blue-500 text-black shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'border-white/10 text-gray-500 hover:text-white'}`}>Active Synthesis</button>
          <button onClick={() => setActiveTab('history')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === 'history' ? 'bg-purple-500 border-purple-500 text-black shadow-[0_0_20px_rgba(168,85,247,0.5)]' : 'border-white/10 text-gray-500 hover:text-white'}`}>The Archives</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {activeTab === 'active' ? (
          <div className="space-y-24">
            <section className="bg-gradient-to-b from-blue-600/10 to-transparent border border-blue-500/20 p-8 md:p-12 rounded-[3.5rem] shadow-[0_0_80px_rgba(37,99,235,0.1)]">
              <div className="text-center mb-16">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] block mb-4">Winning Thesis</span>
                <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-tight">{data.winningTopic}</h2>
              </div>
              <div className="space-y-16 mb-16">
                {thoughts.map((thought: any, i: number) => (
                  <div key={i} className={`relative pl-12 border-l ${thought.isUser ? 'border-white bg-white/5 p-6 rounded-r-3xl' : 'border-blue-500/20'}`}>
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
                    <div className="flex items-center justify-between"><span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><Zap size={12}/> Architect Interjection</span><span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{(user as any).tokens_remaining} Tokens Avail.</span></div>
                    <textarea value={interjection} onChange={(e) => setInterjection(e.target.value)} placeholder="Insert directive into the Council logic stream..." className="w-full bg-black/40 border border-white/10 p-6 rounded-[2rem] text-sm text-white focus:border-blue-500 outline-none h-32 resize-none" />
                    <button onClick={handleInterjection} disabled={sendingInterjection || !interjection.trim()} className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-3">{sendingInterjection ? <Loader2 className="animate-spin" size={16}/> : <><MessageSquare size={16}/> Transmit Directive</>}</button>
                  </div>
                ) : <div className="text-center p-12 border border-dashed border-white/5 rounded-[2.5rem]"><p className="text-gray-600 font-bold italic">Insufficient tokens for Council Interjection.</p></div>}
              </div>

              {/* Utility Bar */}
              <div className="flex flex-wrap justify-center gap-8 mt-12 text-gray-500 border-t border-white/5 pt-10">
                <button className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-white transition-colors"><Printer size={14}/> Print</button>
                <button onClick={handleSavePDF} className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-white transition-colors"><Save size={14}/> Save PDF</button>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-white transition-colors"><Share2 size={14}/> Share</button>
              </div>
            </section>
          </div>
        ) : (
          <section className="grid gap-6">
            {history.length > 0 ? history.map((entry: any) => (
              <div key={entry.id} className="p-8 bg-gray-900/30 border border-white/5 rounded-[2.5rem] hover:border-purple-500/30 transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{new Date(entry.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tight text-white group-hover:text-purple-400 transition-colors">{entry.winningTopic}</h3>
              </div>
            )) : <p className="text-center text-gray-600 italic py-24">The Archives are currently empty.</p>}
          </section>
        )}
      </div>
    </div>
  );
}
