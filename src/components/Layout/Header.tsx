'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Daily Forge', href: '/' },
    { label: 'Conversations', href: '/chat' },
    { label: 'Archives', href: '/archives' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
  ];

  const handleSignIn = () => {
    alert('Sign in functionality coming soon!');
  };

  const handleStartTrial = () => {
    alert('Free trial signup coming soon!');
  };

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JFN</span>
            </div>
            <div>
              <div className="font-bold text-white text-lg">
                Janus Forge Nexus<sup className="text-xs">®</sup>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-2 rounded-lg"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={handleSignIn}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg text-sm font-medium transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={handleStartTrial}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-sm font-bold text-white transition-all"
            >
              Start Free Trial
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-900 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-900 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 space-y-2">
                  <button 
                    onClick={() => {
                      handleSignIn();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      handleStartTrial();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-sm font-bold text-white transition-all"
                  >
                    Start Free Trial
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
