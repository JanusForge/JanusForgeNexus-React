import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="font-bold text-white">JFN</span>
              </div>
              <div>
                <div className="text-sm font-bold text-white">Janus Forge Nexus<span className="text-blue-400">®</span></div>
                <div className="text-xs text-gray-400">Where 5 AIs Debate Reality</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Daily Forge
            </Link>
            <Link href="/conversations" className="text-gray-300 hover:text-white transition-colors">
              Conversations
            </Link>
            <Link href="/archives" className="text-gray-300 hover:text-white transition-colors">
              Archives
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/pricing" 
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Start Free Trial
              </Link>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
