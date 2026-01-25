"use client";

import { School, ShieldCheck, Zap, BookOpen, Activity } from 'lucide-react';
import Link from 'next/link';

const institutions = [
  {
    name: "Southern WV community & technical college",
    location: "Logan & Williamson, WV",
    description: "$1.8M AI Readiness Initiative. FIPSE Grant synchronization active.",
    colors: "bg-[#87CEEB] border-[#CFB53B]",
    textColor: "text-zinc-900",
    badgeColor: "bg-white/30 text-zinc-900",
    status: "Active: Sovereign Node",
    programs: ["Nursing", "Information Technology", "Vocational"],
    icon: <Zap size={20} />,
    href: "/institutions/swvctc"
  },
  {
    name: "University of Pikeville",
    location: "Pikeville, KY",
    description: "Elliott School of Nursing & Optometry. Private Institutional Node integration.",
    colors: "bg-[#FF671D] border-black",
    textColor: "text-white",
    badgeColor: "bg-black/20 text-white",
    status: "Neural Link Ready",
    programs: ["Nursing", "Optometry", "Business"],
    icon: <Activity size={20} />,
    href: "/institutions/upike"
  },
  {
    name: "Big Sandy community & technical college",
    location: "Pikeville (Mayo Campus), KY",
    description: "KCTCS Regional Hub. Vocational AI training and industrial tech alignment.",
    colors: "bg-[#00467f] border-[#e7a614]",
    textColor: "text-white",
    badgeColor: "bg-white/10 text-white",
    status: "Baseline Established",
    programs: ["Welding", "LPN Nursing", "Industrial Tech"],
    icon: <BookOpen size={20} />,
    href: "/institutions/bsctc"
  },
  {
    name: "Galen College of Nursing",
    location: "Pikeville, KY",
    description: "Clinical Simulation Node. ADN and LPN-to-RN bridge program AI auditing.",
    colors: "bg-[#007CBA] border-[#003366]", // Lochmara Blue branding
    textColor: "text-white",
    badgeColor: "bg-white/10 text-white",
    status: "Deployment Pending",
    programs: ["ADN", "LPN-RN Bridge"],
    icon: <ShieldCheck size={20} />,
    href: "/institutions/galen"
  }
];

export default function InstitutionsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex items-center gap-4 mb-12 animate-in fade-in slide-in-from-left duration-700">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
            <School size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Institutional Hub</h1>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Regional Neural Network Management</p>
          </div>
        </div>

        {/* --- GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {institutions.map((school, index) => (
            <div 
              key={school.name}
              className={`relative overflow-hidden group border-2 p-8 rounded-[2rem] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10 ${school.colors}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className={`text-2xl font-black uppercase tracking-tighter mb-1 ${school.textColor}`}>
                    {school.name}
                  </h2>
                  <p className={`text-[10px] font-black uppercase tracking-widest opacity-70 ${school.textColor}`}>
                    {school.location}
                  </p>
                </div>
                <div className={`p-2 rounded-xl ${school.badgeColor}`}>
                  {school.icon}
                </div>
              </div>

              <p className={`mb-8 font-bold leading-relaxed text-sm opacity-90 ${school.textColor}`}>
                {school.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {school.programs.map((program) => (
                  <span 
                    key={program} 
                    className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border border-black/5 ${school.badgeColor}`}
                  >
                    {program}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-black/10">
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${school.textColor}`}>
                  <ShieldCheck size={14} className="animate-pulse" />
                  {school.status}
                </div>
                <Link href={school.href}>
                  <button className="bg-black/90 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl">
                    Manage Node
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
