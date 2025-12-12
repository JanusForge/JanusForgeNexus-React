// src/components/Layout/Header.tsx
export default function Header() {
  const navItems = ['Daily Forge', 'Conversations', 'Archives', 'Pricing', 'About'];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur-md supports-[backdrop-filter]:bg-black/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Branding */}
          <div className="flex items-center">
            <a 
              href="/" 
              className="flex items-center space-x-3 group transition-opacity hover:opacity-90"
            >
              {/* Logo Icon */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-sm font-bold text-white">JF</span>
              </div>
              
              <div className="flex flex-col">
                <div className="text-xl font-bold tracking-tight text-white">
                  Janus Forge Nexus<span className="text-blue-400">®</span>
                </div>
                <div className="text-xs text-gray-400 group-hover:text-blue-300 transition-colors duration-300">
                  Where Intelligence Converges
                </div>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase().replace(' ', '-')}`}
                className="relative px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-300 hover:text-white group"
              >
                {item}
                {/* Animated gradient underline */}
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-3/4"></span>
              </a>
            ))}
            
            {/* Auth Buttons */}
            <div className="ml-6 flex items-center space-x-4 border-l border-gray-800 pl-6">
              <a
                href="/signin"
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Sign In
              </a>
              <a
                href="/start"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:shadow-blue-900/30"
              >
                Start Free Trial
              </a>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
