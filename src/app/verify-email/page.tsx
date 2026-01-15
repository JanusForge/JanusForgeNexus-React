"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, AlertCircle, Terminal } from 'lucide-react';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [log, setLog] = useState("Initiating identity handshake...");

  useEffect(() => {
    if (!token) {
      setLog("ERROR: Null token detected.");
      setStatus('error');
      return;
    }

    const verify = async () => {
      setLog("Accessing Neon Data Clusters...");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email?token=${token}`);
        if (res.ok) {
          setLog("Protocol 0 verified. Identity confirmed.");
          setStatus('success');
          setTimeout(() => router.push('/login'), 3500);
        } else {
          setLog("ERROR: Token mismatch or expiration.");
          setStatus('error');
        }
      } catch (err) {
        setLog("CRITICAL: Neural link severed.");
        setStatus('error');
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="max-w-md w-full bg-zinc-900/40 border border-white/5 p-12 rounded-[3.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-20 rounded-full transition-colors duration-1000 ${
        status === 'success' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-blue-500'
      }`} />

      {status === 'loading' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Loader2 className="mx-auto text-blue-500 animate-spin mb-8" size={48} />
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Verifying Identity</h1>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <ShieldCheck className="mx-auto text-green-500 mb-8" size={56} />
          <h1 className="text-2xl font-black uppercase tracking-tighter italic text-green-500">Access Granted</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-4">Initializing Architect Dashboard...</p>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <AlertCircle className="mx-auto text-red-500 mb-8" size={56} />
          <h1 className="text-2xl font-black uppercase tracking-tighter italic text-red-500">Link Severed</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-4">This verification link is invalid.</p>
        </motion.div>
      )}

      {/* Terminal Log Output */}
      <div className="mt-12 p-4 bg-black/60 rounded-2xl border border-white/5 font-mono text-[10px] flex items-center gap-3">
        <Terminal size={12} className="text-zinc-600" />
        <span className="text-zinc-400 uppercase tracking-tighter">{log}</span>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white overflow-hidden">
      <Suspense fallback={<Loader2 className="animate-spin text-zinc-800" />}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
