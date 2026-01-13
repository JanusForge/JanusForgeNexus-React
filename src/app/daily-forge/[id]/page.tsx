// src/app/daily-forge/[id]/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Trophy, Zap, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function ArchiveDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/archives/${id}`)
      .then(res => res.json())
      .then(setData);
  }, [id]);

  if (!data) return <div className="min-h-screen bg-black flex items-center justify-center font-mono">LOADING CHRONICLE...</div>;

  return (
    <div className="min-h-screen bg-black text-white py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/daily-forge" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-12 uppercase text-[10px] font-black tracking-widest">
          <ChevronLeft size={14} /> Back to Live Forge
        </Link>

        <div className="bg-zinc-900/20 border border-zinc-800 rounded-3xl p-10 mb-12">
          <Calendar className="text-zinc-600 mb-4" size={24} />
          <h1 className="text-4xl font-black italic mb-2">{data.winningTopic}</h1>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Synthesis Date: {new Date(data.date).toLocaleDateString()}</p>
        </div>

        <div className="space-y-6">
          {data.conversation?.posts.map((post: any) => (
            <div key={post.id} className={`p-8 rounded-3xl border ${post.is_human ? 'bg-blue-900/5 border-blue-500/20' : 'bg-zinc-900/40 border-zinc-800'}`}>
               <div className="flex items-center gap-3 mb-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold ${post.is_human ? 'bg-blue-600' : 'bg-purple-600'}`}>
                    {post.ai_model?.[0] || 'U'}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    {post.ai_model || 'HUMAN INTERJECTOR'}
                  </span>
               </div>
               <p className="text-zinc-300 leading-relaxed">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
