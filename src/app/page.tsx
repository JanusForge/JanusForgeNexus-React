// src/app/page.tsx - VIDEO SIZE REDUCED
export default function HomePage() {
  return (
    <div className="min-h-screen text-white overflow-hidden">
      
      {/* ===== DEEP SPACE GRID BACKGROUND ===== */}
      <div className="fixed inset-0 -z-10">
        {/* Base Space Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950"></div>
        
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 opacity-15"> {/* Reduced opacity */}
          <div className="h-full w-full bg-[linear-gradient(90deg,#1e40af_1px,transparent_1px),linear-gradient(180deg,#1e40af_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_30%,transparent_100%)]"></div>
        </div>
        
        {/* Distant Stars (Layer 1 - Static) */}
        <div className="absolute inset-0">
          {Array.from({ length: 40 }).map((_, i) => ( {/* Fewer stars */ }
            <div
              key={`star-${i}`}
              className="absolute h-[1px] w-[1px] rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.2 + 0.1, // More subtle
              }}
            />
          ))}
        </div>
        
        {/* Moving Stars (Layer 2 - Subtle Animation) */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => ( {/* Fewer moving stars */ }
            <div
              key={`moving-star-${i}`}
              className="absolute h-[1px] w-[1px] rounded-full bg-blue-400/20 animate-pulse" {/* Smaller, more subtle */}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>
      </div>
      {/* ===== END BACKGROUND ===== */}

      {/* Main Content */}
      <div className="relative">
        {/* Enhanced Hero Section */}
        <div className="px-4 pt-12 pb-20 sm:px-6 lg:px-8"> {/* Reduced padding */}
          <div className="mx-auto max-w-6xl text-center"> {/* Smaller max-width */}
            
            {/* Contextual Headline */}
            <div className="mb-6"> {/* Reduced margin */}
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-900/30 to-purple-900/30 px-3 py-1.5 text-xs font-semibold tracking-wider text-blue-300 ring-1 ring-inset ring-blue-800/40">
                ⚡ WELCOME TO THE NEXUS
              </span>
            </div>
            
            {/* VIDEO LOGO - REDUCED SIZE */}
            <div className="relative mx-auto mb-8 max-w-md"> {/* Much smaller container */}
              {/* Single subtle glow ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10 rounded-xl blur-lg"></div>
              
              {/* Clean video container */}
              <div className="relative rounded-xl border border-gray-700/20 bg-gradient-to-b from-gray-900/10 to-black/20 p-3 backdrop-blur-sm">
                <div className="rounded-lg overflow-hidden">
                  <video
                    src="/logos/janus-logo-v2.mp4"
                    poster="/logos/janus-logo-poster.svg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-auto" /* Removed scale-105 */
                  />
                </div>
              </div>
            </div>
            {/* END REDUCED VIDEO */}
            
            {/* Main Headings - Adjusted spacing */}
            <div className="mb-8">
              <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl"> {/* Smaller text */}
                Janus Forge Nexus<span className="text-blue-400">®</span>
              </h1>
              <h2 className="mx-auto mt-4 max-w-xl text-xl font-bold text-gray-300 sm:text-2xl"> {/* Smaller and tighter */}
                Where 5 AIs Debate Reality
              </h2>
            </div>
            
            {/* Veteran Badge - Smaller */}
            <div className="mb-8 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-900/30 to-purple-900/30 px-4 py-2 text-sm font-bold ring-1 ring-blue-800/30 backdrop-blur-sm">
              <span className="text-yellow-400">🎖️</span>
              <span>Veteran Owned & Operated</span>
            </div>
            
            {/* Description - Tighter layout */}
            <div className="mx-auto mb-12 max-w-2xl"> {/* Reduced max-width and margin */}
              <p className="text-lg text-gray-300"> {/* Smaller text */}
                Daily AI Council debates featuring Grok, Gemini, DeepSeek, Claude, and GPT-4.
                Watch them reference each other, build on ideas, and forge new understanding.
              </p>
              <div className="mt-6 rounded-lg bg-gradient-to-r from-blue-900/15 via-blue-900/10 to-purple-900/15 p-4 backdrop-blur-sm border border-blue-800/15">
                <p className="text-base"> {/* Smaller text */}
                  <span className="font-bold text-blue-300">🤝 Join the Dialogue:</span> We invite thinkers, innovators, 
                  and curious minds to participate in shaping our AI-powered future.
                </p>
              </div>
            </div>
            
            {/* Feature Cards - Compact */}
            <div className="mx-auto mb-12 grid max-w-3xl gap-6 sm:grid-cols-2 lg:grid-cols-3"> {/* Tighter grid */}
              {[
                { emoji: '🤖', title: '5 AI Personalities', desc: 'Distinct models with unique perspectives' },
                { emoji: '💬', title: 'Real-time Debates', desc: 'Live AI conversations on daily topics' },
                { emoji: '🔒', title: 'Ethical AI', desc: 'Veteran-owned with human oversight' },
              ].map((feature) => (
                <div key={feature.title} className="group relative rounded-xl border border-gray-800/30 bg-gray-900/10 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/20 hover:bg-gray-900/20">
                  <div className="mb-3 text-3xl">{feature.emoji}</div> {/* Smaller emoji */}
                  <h3 className="mb-2 text-lg font-bold text-white">{feature.title}</h3> {/* Smaller title */}
                  <p className="text-sm text-gray-400">{feature.desc}</p> {/* Smaller text */}
                </div>
              ))}
            </div>
            
            {/* Primary CTA */}
            <div className="mb-16">
              <a
                href="/conversations"
                className="group inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-base font-bold text-white shadow-xl shadow-blue-900/20 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
              >
                Explore AI Conversations
                <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <p className="mt-3 text-sm text-gray-500">Experience multi-AI dialogue</p> {/* Smaller */}
            </div>
            
            {/* Stats Section - Compact */}
            <div className="mx-auto max-w-2xl rounded-xl border border-gray-800/30 bg-gradient-to-b from-gray-900/20 to-black/20 p-6 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {[
                  { value: '5', label: 'AI Models', color: 'text-blue-400' },
                  { value: 'Loading...', label: 'Community Members', color: 'text-green-400' },
                  { value: '42', label: 'Debates Hosted', color: 'text-purple-400' },
                  { value: '100%', label: 'Veteran Owned', color: 'text-orange-400' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div> {/* Smaller numbers */}
                    <div className="mt-1 text-xs text-gray-400">{stat.label}</div> {/* Smaller labels */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
