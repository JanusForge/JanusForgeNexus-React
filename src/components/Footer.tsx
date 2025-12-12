import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Cookie Policy', href: '/legal/cookies' },
    { name: 'GDPR Compliance', href: '/legal/gdpr' },
    { name: 'AI Ethics Policy', href: '/legal/ai-ethics' },
  ];

  const technicalLinks = [
    { name: 'System Architecture', href: 'https://www.janusforge.ai/architecture', external: true },
    { name: 'API Documentation', href: '/technical/api-docs' },
    { name: 'Security Overview', href: '/technical/security' },
    { name: 'Status Page', href: '/technical/status' },
  ];

  const contactLinks = [
    { 
      name: 'Support', 
      email: 'support@janusforge.ai',
      description: 'Technical support and help'
    },
    { 
      name: 'Press & Media', 
      email: 'press@janusforge.ai',
      description: 'Media inquiries and press kit'
    },
    { 
      name: 'Business', 
      email: 'partnerships@janusforge.ai',
      description: 'Partnerships and enterprise'
    },
    { 
      name: 'Legal', 
      email: 'legal@janusforge.ai',
      description: 'Legal inquiries and compliance'
    },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">
                Janus Forge Nexus<span className="text-blue-400">®</span>
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                Where 5 AIs Debate Reality
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <span className="text-sm">🎖️</span>
              </div>
              <div>
                <p className="text-sm font-medium">Veteran Owned & Operated</p>
                <p className="text-xs text-gray-400">Built with Integrity • 🇺🇸</p>
              </div>
            </div>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-xs text-gray-500">
                Full source code available to enterprise clients
              </p>
            </div>
          </div>

          {/* Technical Column */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Technical</h3>
            <ul className="space-y-2">
              {technicalLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                      {link.name === 'System Architecture' && ' ↗'}
                    </a>
                  ) : (
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <button 
                onClick={() => window.open('mailto:partnerships@janusforge.ai', '_blank')}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Contact for enterprise access →
              </button>
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-4">
              {contactLinks.map((contact) => (
                <li key={contact.name}>
                  <p className="text-sm font-medium text-gray-300">{contact.name}</p>
                  <a 
                    href={`mailto:${contact.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors text-sm block mt-1"
                  >
                    {contact.email}
                  </a>
                  <p className="text-xs text-gray-500 mt-1">{contact.description}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-400">
                © {currentYear} Janus Forge Nexus<span className="text-blue-400">®</span>. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Janus Forge Nexus® is a registered trademark of Janus Forge Accelerators, LLC, 
                a Kentucky, Limited Liability Company. Veteran Owned & Operated • Built with Integrity • 🇺🇸
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-xs text-gray-500">
                All AI responses may contain inaccuracies. Use discretion.
              </p>
              <div className="mt-2 flex items-center justify-center md:justify-end space-x-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-400">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
