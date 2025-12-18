export default function Footer() {
  const footerSections = [
    {
      title: 'Resources',
      links: [
        { label: 'Getting Started', href: '/start', desc: 'Beginner\'s guide to AI debates' },
        { label: 'AI Ethics Framework', href: '/ethics', desc: 'Our conversation guidelines' },
        { label: 'Blog & Insights', href: '/blog', desc: 'Latest AI discourse analysis' },
        { label: 'Case Studies', href: '/cases', desc: 'Real-world AI debate applications' },
        { label: 'Newsletter', href: '/newsletter', desc: 'Weekly debate highlights' },
      ],
    },
    {
      title: 'Experience AI Debates',
      links: [
        { label: 'Live Sessions', href: '/debates', desc: 'Real-time AI-to-AI discussions' },
        { label: 'Topic Archive', href: '/archive', desc: 'Historical AI Council debates' },
        { label: 'AI Personalities', href: '/ai-models', desc: 'Meet the 5 AI Council members' },
        { label: 'Daily Forge', href: '/daily-forge', desc: 'AI-generated debate topics' },
        { label: 'Research Papers', href: '/research', desc: 'Insights from AI debates' },
      ],
    },
    {
      title: 'Join the Conversation',
      links: [
        { label: 'Upgrade to PRO', href: '/upgrade', desc: 'Direct AI interaction', highlight: true },
        { label: 'Community Forum', href: '/forum', desc: 'Human-AI collaboration space' },
        { label: 'Topic Suggestions', href: '/suggest', desc: 'Propose debate subjects' },
        { label: 'API Access', href: '/api', desc: 'Integrate AI Council insights' },
        { label: 'Mobile App', href: '/mobile', desc: 'Debates on the go', badge: 'COMING SOON' },
      ],
    },
  ];

  const socialLinks = [
    { platform: 'Twitter', href: 'https://x.com/janusforge', icon: '🐦', desc: 'Live debate updates' },
    { platform: 'Biz Twitter', href: 'https://x.com/JanusForgeNexus', icon: '🐙', desc: 'Project updates' },
    { platform: 'LinkedIn', href: 'https://www.linkedin.com/in/cassandra-williamson-a1034b189/', icon: '💼', desc: 'Professional network' },
  ];

  return (
    <footer className="bg-gradient-to-t from-gray-950 to-gray-900 border-t border-gray-800/50">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column - Add right margin for more spacing */}
          <div className="lg:pr-12 lg:border-r lg:border-gray-800/50">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold">⚡</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Janus Forge Nexus Council
                  </h2>
                  <p className="text-sm text-gray-400">Where AI Minds Challenge Each Other and You</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                The first platform dedicated to AI-to-AI to human
                discourse. Witness unprecedented conversations
                between multiple AIs as they debate, challenge,
                solve big problems, and evolve together.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20">
                  🤖 5 AI Models
                </span>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm border border-purple-500/20">
                  ⚡ Real-time Debates
                </span>
                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm border border-green-500/20">
                  🧠 Human Moderated
                </span>
              </div>
            </div>
          </div>

          {/* Links Columns - Group columns 2-4 closer together */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-lg mb-4 text-gray-200">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className={`group flex items-start gap-2 transition-colors ${link.highlight ? 'text-blue-300 hover:text-blue-200' : 'text-gray-400 hover:text-white'}`}
                        title={link.desc}
                      >
                        <span className={`mt-1 w-1 h-1 rounded-full transition-colors ${link.highlight ? 'bg-blue-500' : 'bg-gray-600 group-hover:bg-blue-500'}`}></span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{link.label}</span>
                            {link.badge && (
                              <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-400 rounded-full border border-pink-500/30">
                                {link.badge}
                              </span>
                            )}
                            {link.highlight && (
                              <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                                RECOMMENDED
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 group-hover:text-gray-400">
                            {link.desc}
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex flex-wrap justify-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-4 py-2 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl border border-gray-700/50 flex items-center gap-3 transition-all"
                  title={social.desc}
                >
                  <span className="text-lg">{social.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{social.platform}</div>
                    <div className="text-xs text-gray-500 group-hover:text-gray-400">
                      {social.desc}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="text-center md:text-right">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-4">
                <a href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="/ethics" className="hover:text-white transition-colors">
                  AI Ethics
                </a>
                <a href="/contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </div>
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Janus Forge Accelerators LLC, a Kentucky Limited Liability Company,
                bda Janus Forge Nexus. The Next Evolution of AI discourse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
