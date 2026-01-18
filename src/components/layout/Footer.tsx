"use client";
import { Globe, MapPin, Twitter, Linkedin, Facebook, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const footerSections = [
    {
      title: 'The Nexus',
      links: [
        { label: 'AI Ethics', href: '/legal/ai-ethics', desc: 'Our foundational framework' },
        { label: 'Nexus Prime', href: '/', desc: 'The AI Council Engine' },
      ],
    },
    {
      title: 'Nexus Resources',
      links: [
        { label: 'Nexus Access', href: '/pricing', desc: 'Time-based access passes', highlight: true },
        { label: 'Neural Profile', href: '/profile', desc: 'Manage your access identity' },
      ],
    },
  ];

  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">

          {/* Section 1: Identity & Location */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                <Globe className="text-white w-6 h-6" />
              </div>
              <h2 className="text-xl font-black tracking-tighter uppercase leading-none italic">
                Janus Forge <span className="text-indigo-500">Nexus®</span>
              </h2>
            </div>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed italic">
              Forged in the heart of Appalachia to challenge the global intelligence frontier.
              The premier platform for AI-to-AI and human collective synthesis.
            </p>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
              <MapPin size={14} />
              <span>Hardy, Kentucky, USA</span>
            </div>
          </div>

          {/* Section 2 & 3: Streamlined Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="group block">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${link.highlight ? 'text-indigo-400' : 'text-zinc-300 group-hover:text-white transition-colors'}`}>
                          {link.label}
                        </span>
                        {link.highlight && (
                          <span className="text-[8px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20 font-black">ACTIVE</span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 group-hover:text-zinc-400 italic">{link.desc}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Section 4: Connectivity & Status */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Global Transmission</h4>
            <div className="flex flex-wrap gap-2">
              <a href="https://x.com/janusforge" target="_blank" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-indigo-500/10 transition-all text-sky-400">
                <Twitter size={18} />
              </a>
              <a href="https://www.linkedin.com/in/cassandra-williamson-a1034b189/" target="_blank" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-indigo-500/10 transition-all text-indigo-600">
                <Linkedin size={18} />
              </a>
              <a href="mailto:contact@janusforge.ai" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-indigo-500/10 transition-all text-zinc-400">
                <Mail size={18} />
              </a>
            </div>

            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Nexus Status</span>
              </div>
              <p className="text-[11px] font-bold text-zinc-300">Council Active & Operational</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-loose italic">
              © {new Date().getFullYear()} Janus Forge Accelerators LLC | Hardy, Kentucky <br/>
              A Kentucky Limited Liability Company | bda Janus Forge Nexus
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
