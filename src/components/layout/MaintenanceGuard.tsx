"use client";
import { ShieldAlert, Lock } from 'lucide-react';

export function MaintenanceGuard({ children, isLocked, isMaster }: { children: React.ReactNode, isLocked: boolean, isMaster: boolean }) {
  // If the site is locked but you are the Master Authority, let you through
  if (isLocked && !isMaster) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-red-600/20 blur-[100px] rounded-full" />
          <div className="relative p-8 border-2 border-red-600/30 rounded-full">
            <ShieldAlert size={80} className="text-red-600 animate-pulse" />
          </div>
          <Lock className="absolute bottom-0 right-0 text-white bg-red-600 p-2 rounded-lg" size={32} />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
          System Integrity <span className="text-red-600">Protocol Active</span>
        </h1>
        
        <h2 className="text-xl text-blue-400 font-bold uppercase tracking-[0.2em] mb-8">
          Forge Temporarily Offline
        </h2>

        <p className="max-w-md text-zinc-500 text-sm leading-relaxed mb-12 uppercase tracking-tight">
          Master Authority has initiated system-wide lockdown for emergency maintenance. 
          All synthesis operations suspended. Stand by for reconnections.
        </p>

        <div className="pt-8 border-t border-white/5 w-full max-w-xs">
          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.5em]">
            Janus Forge Nexus • © 2026
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
