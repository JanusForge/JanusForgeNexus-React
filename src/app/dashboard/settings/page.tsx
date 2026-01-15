"use client";
import { useAuth } from '@/components/auth/AuthProvider';
import { User, Shield, Bell, Zap } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-4xl animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-white uppercase italic mb-2 tracking-tighter">Architect Settings</h1>
      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-12">Calibrate your Nexus connection</p>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-blue-500/10 rounded-2xl">
              <User className="text-blue-500" size={24} />
            </div>
            <div>
              <h3 className="text-white font-black uppercase text-sm">Identity Profile</h3>
              <p className="text-zinc-500 text-[10px] uppercase">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase ml-2">Public Username</label>
              <input disabled value={user?.username} className="w-full bg-black/50 border border-white/5 rounded-xl py-3 px-4 text-zinc-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase ml-2">Nexus Tier</label>
              <input disabled value={user?.tier} className="w-full bg-black/50 border border-white/5 rounded-xl py-3 px-4 text-indigo-500 font-bold" />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-red-500/10 rounded-2xl">
              <Shield className="text-red-500" size={24} />
            </div>
            <div>
              <h3 className="text-white font-black uppercase text-sm">Security Key</h3>
              <p className="text-zinc-500 text-[10px] uppercase">Rotate your access credentials</p>
            </div>
          </div>
          <button className="px-6 py-2 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase hover:bg-white hover:text-black transition-all">
            Update Key
          </button>
        </div>
      </div>
    </div>
  );
}
