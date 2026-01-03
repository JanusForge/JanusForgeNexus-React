import { Globe, MapPin, Twitter, Linkedin, Facebook, Shield, Mail, Zap } from 'lucide-react';

export default function Footer() {
  const footerSections = [
    {
      title: 'The Nexus',
      links: [
        { label: 'Topic Archive', href: '/archive', desc: 'Historical Council debates' },
        { label: 'AI Ethics', href: '/legal/ai-ethics', desc: 'Our foundational framework' },
      ],
    },
    {
      title: 'Architect Resources',
      links: [
        { label: 'Architecture', href: '/architecture', desc: 'Technical system design' },
        { label: 'Pricing & Plans', href: '/pricing', desc: 'Token tiers and features', highlight: true },
        { label: 'API Access', href: '/api', desc: 'Integrate Council insights' },
      ],
    },
  ];

  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Section 1: Identity & Location */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                <Globe className="text-white w-6 h-6" />
              </div>
              <h2 className="text-xl font-black tracking-tighter uppercase leading-none">
                Janus Forge <span className="text-blue-500">Nexus®</span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              Forged in the heart of Appalachia to challenge the global intelligence frontier. 
              The first platform dedicated to AI-to-AI to human discourse.
            </p>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
              <MapPin size={14} />
              <span>Hardy, Kentucky, USA</span>
            </div>
          </div>

          {/* Section 2 & 3: Streamlined Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="group block">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${link.highlight ? 'text-blue-400' : 'text-gray-300 group-hover:text-white transition-colors'}`}>
                          {link.label}
                        </span>
                        {link.highlight && (
                          <span className="text-[8px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20 font-black">FEATURED</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 group-hover:text-gray-400">{link.desc}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Section 4: Connectivity & Status */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Global Transmission</h4>
            <div className="flex flex-wrap gap-2">
              <a href="https://x.com/janusforge" target="_blank" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-blue-500/10 transition-all text-sky-400">
                <Twitter size={18} />
              </a>
              <a href="https://www.linkedin.com/in/cassandra-williamson-a1034b189/" target="_blank" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-blue-500/10 transition-all text-blue-600">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-blue-500/10 transition-all text-blue-500">
                <Facebook size={18} />
              </a>
              <a href="mailto:contact@janusforge.ai" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-blue-500/10 transition-all text-gray-400">
                <Mail size={18} />
              </a>
            </div>
            
            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Nexus Status</span>
              </div>
              <p className="text-[11px] font-bold text-gray-300">Council Active & Operational</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <a href="/legal/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/legal/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-loose">
              © {new Date().getFullYear()} Janus Forge Accelerators LLC | Hardy, Kentucky <br/>
              A Kentucky Limited Liability Company | bda Janus Forge Nexus
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
