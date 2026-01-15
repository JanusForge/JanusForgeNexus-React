export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-white uppercase italic mb-6">Neural Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-zinc-900/50 rounded-[2rem] border border-white/5 animate-pulse flex items-center justify-center">
          <p className="text-zinc-500 font-mono text-xs uppercase">Loading Synthesis Volume...</p>
        </div>
        <div className="h-64 bg-zinc-900/50 rounded-[2rem] border border-white/5 animate-pulse flex items-center justify-center">
          <p className="text-zinc-500 font-mono text-xs uppercase">Loading Token Velocity...</p>
        </div>
      </div>
    </div>
  );
}
