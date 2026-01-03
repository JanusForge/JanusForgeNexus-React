"use client";
import {
  Search, Globe, ChevronRight, Loader2,
  Rss, Printer, Save, Share2, MessageSquare, Volume2, Square, Mail, CheckCircle2, History, Zap, X, Star, Download, Link as LinkIcon
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
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchDailyForge();
    fetchHistory();
    if (user) setIsSubscribed((user as any).digest_subscribed ?? true);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, [user]);

  const handleReadAloud = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }
    const rawThoughts = data?.openingThoughts;
    const thoughtsArray = Array.isArray(rawThoughts) ? rawThoughts : JSON.parse(rawThoughts || "[]");
    if (thoughtsArray.length === 0) return;
    const fullText = thoughtsArray.map((t: any) => `${t.model} perspective: ${t.content}`).join(". Next. ");
    const utterance = new SpeechSynthesisUtterance(fullText);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(v => v.lang.includes('en-US')) || voices[0];
    utterance.rate = 0.9;
    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrint = () => { window.print(); };

  const handleSavePDF = () => {
    if (!data) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("JANUS FORGE: DAILY SYNTHESIS", 20, 20);
    doc.setFontSize(16);
    doc.text(data.winningTopic, 20, 40);
    doc.setFontSize(12);
    const thoughts = Array.isArray(data.openingThoughts) ? data.openingThoughts : JSON.parse(data.openingThoughts || "[]");
    let y = 60;
    thoughts.forEach((t: any) => {
      doc.text(`${t.model || 'Council'}:`, 20, y);
      y += 10;
      const lines = doc.splitTextToSize(t.content || "", 170);
      doc.text(lines, 25, y);
      y += lines.length * 7 + 10;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save(`DailyForge_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const shareToX = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out today's Daily Forge debate: ${data.winningTopic}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
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
        const councilPosts = result.councilResponses.map((r: any) => ({
          model: r.model,
          content: r.content,
          isUser: false
        }));
        setData((prev: any) => ({
          ...prev,
          openingThoughts: [userDirective, ...councilPosts, ...prev.openingThoughts]
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

  // Robust parsing of openingThoughts to prevent "undefined" spam
  const thoughts = (() => {
    if (!data?.openingThoughts) return [];
    try {
      const parsed = typeof data.openingThoughts === 'string' 
        ? JSON.parse(data.openingThoughts) 
        : data.openingThoughts;
      return Array.isArray(parsed) ? parsed.filter(t => t && t.model && t.content) : [];
    } catch (e) {
      console.error("Failed to parse openingThoughts", e);
      return [];
    }
  })();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 pb-24">
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
          <div className="bg-gray-900 border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full space-y-6 relative">
            <button onClick={() => setShowShareModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X size={20}/></button>
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Distribute Synthesis</h4>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={shareToX} className="p-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase text-center hover:bg-blue-500 hover:text-black transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X / Twitter
              </button>
              <button onClick={shareToLinkedIn} className="p-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase text-center hover:bg-blue-500 hover:text-black transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.053.501.082.749.082.361 0 .717-.035 1.061-.103a4.035 4.035 0 0 1-3.235-3.955v-.05c.537.299 1.162.463 1.77.48a4.07 4.07 0 0 1-1.807-3.381 11.484 11.484 0 0 0 8.342 4.237 4.074 4.074 0 0 1 6.903-3.715 8.134 8.134 0 0 0 2.573-.988 4.038 4.038 0 0 1-1.777 2.225 8.094 8.094 0 0 0 2.327-.635 8.168 8.168 0 0 1-2.012 2.091z"/>
                </svg>
                LinkedIn
              </button>
              <button onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied!");
              }} className="col-span-2 p-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase text-center hover:bg-blue-500 hover:text-black transition-all flex items-center justify-center gap-2">
                <LinkIcon size={16} />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent uppercase text-shadow-glow">The Daily <span className="text-blue-500">Forge</span></h1>
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => setActiveTab('active')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${activeTab === 'active' ? 'bg-blue-500 border-blue-500 text-black shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'border-white/10 text-gray-500'}`}>Active Synthesis</button>
          <button onClick={() => setActiveTab('history')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${activeTab === 'history' ? 'bg-purple-500 border-purple-500 text-black shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'border-white/10 text-gray-500'}`}>The Archives</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {activeTab === 'active' ? (
          <div className="space-y-24">
            {/* Header with Print/Save/Share */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                The Daily Forge
              </h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <Printer size={18} />
                  Print
                </button>
                <button
                  onClick={handleSavePDF}
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition flex items-center gap-2"
                >
                  <Download size={18} />
                  Save PDF
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition flex items-center gap-2"
                >
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>

            <section className="bg-gradient-to-b from-blue-600/10 to-transparent border border-blue-500/20 p-8 md:p-12 rounded-[3.5rem] shadow-[0_0_80px_rgba(37,99,235,0.1)]">
              <div className="text-center mb-16">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] block mb-4">Winning Thesis</span>
                <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-tight">{data.winningTopic}</h2>
              </div>
              <div className="space-y-16 mb-16">
                {thoughts.map((thought: any, i: number) => (
                  <div key={i} className={`relative pl-12 border-l ${thought.isUser ? 'border-white bg-white/5 p-6 rounded-r-3xl' : 'border-blue-500/20'} animate-in fade-in slide-in-from-left-4 duration-700`}>
                    <div className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full ${thought.isUser ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]' : 'bg-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.6)]'}`}></div>
                    <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${thought.isUser ? 'text-white' : 'text-blue-400'}`}>
                      {thought.model === "ARCHITECT" ? (
                        <>
                          {(user as any)?.role === 'BETA_ARCHITECT' || thought.role === 'BETA_ARCHITECT' ? (
                            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500 text-black rounded-md shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                              <Star size={10} fill="currentColor" /> BETA ARCHITECT {user?.username}
                            </span>
                          ) : (
                            `DIRECTIVE FROM ARCHITECT ${user?.username || ''}`
                          )}
                        </>
                      ) : (
                        `${thought.model || 'Council Member'} Response`
                      )}
                    </span>
                    <div className={`${thought.isUser ? 'text-white font-bold italic' : 'text-gray-300 font-medium'} text-base leading-relaxed whitespace-pre-wrap`}>
                      {thought.content || '[No response]'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-12 border-t border-white/5">
                {/* Low Token Warning */}
                {(user as any)?.tokens_remaining <= 4 && (user as any)?.tokens_remaining >= 0 && (
                  <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg text-yellow-300 text-sm">
                    <strong>Warning:</strong> You have {(user as any).tokens_remaining} token{(user as any).tokens_remaining === 1 ? '' : 's'} remaining. 
                    When you run out, you can purchase more in the{' '}
                    <Link href="/pricing" className="underline hover:text-yellow-100">
                      One-Time Fuel Top-up panel
                    </Link>.
                  </div>
                )}

                {isAuthenticated && (user as any).tokens_remaining > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                        <Zap size={12}/> Architect Interjection
                      </span>
                      <span className="text-[10px] font-bold text-gray-500">
                        {(user as any).tokens_remaining} Tokens Available
                      </span>
                    </div>
                    <textarea
  value={interjection}
  onChange={(e) => setInterjection(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleInterjection();
    }
  }}
  placeholder="Insert directive..."
  className="w-full bg-black/40 border border-white/10 p-6 rounded-[2rem] text-sm text-white focus:border-blue-500 h-32 resize-none font-bold"
/>
                    <button
                      onClick={handleInterjection}
                      disabled={sendingInterjection || !interjection.trim()}
                      className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                      {sendingInterjection ? <Loader2 className="animate-spin" size={16}/> : <><MessageSquare size={16}/> Transmit Directive</>}
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-12 border border-dashed border-white/5 rounded-[2.5rem] text-gray-600 font-bold italic">
                    Insufficient tokens for Council Interjection.
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-8 mt-12 text-gray-500 border-t border-white/5 pt-10">
                <button onClick={handleReadAloud} className={`flex items-center gap-2 text-[10px] font-black uppercase transition-all ${isReading ? 'text-red-500' : 'hover:text-white'}`}>
                  {isReading ? <Square size={14} fill="currentColor"/> : <Volume2 size={14}/>} Read Aloud
                </button>
              </div>
            </section>
          </div>
        ) : (
          <section className="grid gap-6">
            {history.length > 0 ? history.map((entry: any) => (
              <div key={entry.id} className="p-8 bg-gray-900/30 border border-white/5 rounded-[2.5rem] hover:border-purple-500/30 group">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-gray-600 uppercase">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase italic text-white group-hover:text-purple-400 transition-colors">
                  {entry.winningTopic}
                </h3>
              </div>
            )) : <p className="text-center text-gray-600 italic py-24">The Archives are currently empty.</p>}
          </section>
        )}
      </div>
    </div>
  );
}
