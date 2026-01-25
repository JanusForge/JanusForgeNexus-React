"use client";

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import NodeCouncil from '@/components/node-ai/NodeCouncil';

export default function UPIKEDashboard() {
  const [activeRole, setActiveRole] = useState<'FACULTY' | 'STUDENT'>('FACULTY');

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link href="/institutions" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4 text-xs font-black uppercase tracking-widest">
              <ArrowLeft size={14} /> Regional Hub
            </Link>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-[#FF671D]">
              UPIKE <span className="text-white">Elliott Node</span>
            </h1>
          </div>
          <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-xl border border-white/5">
            <button onClick={() => setActiveRole('FACULTY')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeRole === 'FACULTY' ? 'bg-[#FF671D] text-black' : 'text-zinc-500'}`}>Clinical Faculty</button>
            <button onClick={() => setActiveRole('STUDENT')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeRole === 'STUDENT' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Student</button>
          </div>
        </div>

        <NodeCouncil 
          institution="UPIKE Elliott" 
          userType={activeRole} 
          accentColor="bg-[#FF671D]" 
        />
      </div>
    </div>
  );
}
