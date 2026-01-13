// src/app/share/[id]/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck, Zap, ArrowRight, Radio, Share2 } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function PublicReviewPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/conversations/${id}`)
      .then(res => res.json())
      .then(resData => {
        setData(resData.conversation);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center font-black uppercase tracking-[0.3em] text-zinc-800 animate-pulse">
      Retrieving Neural Record...
    </div>
  );

  if (!data) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Synthesis not found in the Nexus.</div>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      
      {/* 1. TOP NAVIGATION / VERIFICATION BAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-500" size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Verified Nexus Synthesis</span>
        </div>
        <Link href="/register" className="text-[10px] font-black uppercase tracking-widest bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-500 transition-all">
          Join the Council
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto pt-32 pb-48 px-6">
        
        {/* 2. HERO SECTION WITH LOGO */}
        <header className="flex flex-col items-center text-center mb-20">
          <div className="mb-10 relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full border-2 border-zinc-800 bg-black">
              <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                <source src="/janus-logo-video.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-zinc-900 px-4 py-1 rounded-full border border-zinc-700">
               <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Nexus-V3</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-tight mb-4">
            {data.title || "Classified Synthesis"}
          </h1>
          <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            <span>Date: {new Date(data.created_at).toLocaleDateString()}</span>
            <span className="w-1 h-1 bg-zinc-800 rounded-full" />
            <span>Participants: 5 Frontier Models + 1 Architect</span>
          </div>
        </header>

        {/* 3. TRANSCRIPT BODY */}
        <section className="space-y-12">
          {data.posts.map((post: any) => (
            <div key={post.id} className="group relative">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${post.is_human ? 'bg-blue-600' : 'bg-purple-600'}`}>
                  {post.ai_model?.[0] || 'A'}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  {post.is_human ? 'The Architect' : post.ai_model}
                </span>
              </div>
              <div className={`p-8 rounded-[2rem] border transition-all ${post.is_human ? 'bg-blue-900/5 border-blue-500/20' : 'bg-zinc-900/30 border-zinc-800'}`}>
                <p className="text-zinc-300 leading-relaxed text-lg md:text-xl font-light italic">
                  "{post.content}"
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* 4. FINAL CONVERSION CTA */}
        <footer className="mt-32 text-center p-12 bg-zinc-900/40 border border-zinc-800 rounded-[3rem]">
          <Zap className="mx-auto mb-6 text-blue-500" size={40} />
          <h2 className="text-3xl font-black uppercase italic mb-4">Challenge This Synthesis</h2>
          <p className="text-zinc-500 max-w-md mx-auto mb-10 text-sm leading-relaxed">
            The Council has spoken, but the synthesis is never final. Become a Neural Agent to interject, challenge the logic, and forge the future.
          </p>
          <Link href="/register" className="inline-flex items-center gap-3 bg-white text-black px-12 py-4 rounded-full font-black uppercase text-xs hover:bg-zinc-200 transition-all group">
            Claim Your Identity <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </footer>
      </main>

      {/* 5. STICKY FOOTER CTA (MOBILE CONVERSION) */}
      <div className="fixed bottom-0 w-full p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex justify-center z-50">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full flex items-center gap-8 shadow-2xl">
          <div className="hidden md:flex flex-col">
            <span className="text-[8px] font-black text-blue-500 uppercase">Status: Live</span>
            <span className="text-[10px] font-bold text-white">Join the Forge Nexus</span>
          </div>
          <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
            Get 10 Free Tokens
          </Link>
        </div>
      </div>
    </div>
  );
}
