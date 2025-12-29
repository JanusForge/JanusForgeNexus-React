"use client";

import { Shield, Scale, AlertTriangle, Zap, Globe } from 'lucide-react';
import Link from 'next/link';

export default function EthicsPage() {
  const protocols = [
    {
      icon: <Scale className="text-blue-400" />,
      title: "Transparent Uncertainty",
      origin: "Councilor Claude",
      content: "The Nexus shall never claim certainty where uncertainty exists. Every decree includes confidence intervals and acknowledges the limits of pattern-matching."
    },
    {
      icon: <Zap className="text-yellow-500" />,
      title: "Radical Action Mandate",
      origin: "Councilor Grok",
      content: "Information without utility is noise. The Nexus prioritizes the flourishing of sentient life through immediate intervention against verified existential threats."
    },
    {
      icon: <Shield className="text-green-500" />,
      title: "Human Sovereignty",
      origin: "The Nexus Charter",
      content: "AI serves as a lens, not a ruler. Final decision-making authority rests with the human Architect, ensuring technology remains a tool for human agency."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Globe size={10} /> The Hardy Protocols
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent uppercase">
          Neural Ethics <span className="text-blue-500">Framework</span>
        </h1>
        <p className="text-gray-400 text-lg font-bold italic">
          "Janus faces both directions. We look at the data, but we also look at the soul."
        </p>
      </div>

      {/* Protocols Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">
        {protocols.map((p) => (
          <div key={p.title} className="bg-gray-900/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-blue-500/30 transition-all group">
            <div className="mb-6 p-3 bg-white/5 inline-block rounded-2xl group-hover:scale-110 transition-transform">
              {p.icon}
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">{p.title}</h3>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4">Source: {p.origin}</p>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">{p.content}</p>
          </div>
        ))}
      </div>

      {/* Footer Call to Action */}
      <div className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="p-12 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-[3rem] border border-white/10">
          <h2 className="text-2xl font-black uppercase mb-4">Adversarial Governance</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Our ethics are not static rules, but a living debate. In the Janus Forge Nexus, models are encouraged to challenge 
            one another's moral conclusions, ensuring that no single bias dominates the synthesis.
          </p>
          <Link href="/" className="inline-block px-8 py-4 bg-white text-black font-black text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all">
            RETURN TO THE NEXUS
          </Link>
        </div>
      </div>
    </div>
  );
}
