"use client";
import { useAuth } from '@/components/auth/AuthProvider';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, AlertTriangle, ShieldCheck, Clock, Zap } from 'lucide-react';

const BACKEND_URL = 'https://janusforgenexus-backend.onrender.com';

const NEXUS_PASSES = [
  {
    id: 'pass_24h',
    name: '24H Nexus Pass',
    description: 'Full command of the Council for one solar cycle.',
    price: 5,
    hours: 24,
    stripePriceId: 'price_1Sqe8rGg8RUnSFObq4cv8Mnd'
  },
  {
    id: 'pass_7d',
    name: '7D Strategic Sprint',
    description: 'Extended authority for deep synthesis sessions.',
    price: 20,
    hours: 168,
    stripePriceId: 'price_1SqeAhGg8RUnSFObRUOFFNH7'
  },
  {
    id: 'pass_30d',
    name: '30D Eternal Forge',
    description: 'Mastery of the Nexus. Priority processing.',
    price: 75,
    hours: 720,
    stripePriceId: 'price_1SqeCqGg8RUnSFObHN4ZMCqs'
  }
];

function PricingContent() {
  const { user, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const isAuthenticated = !!user;
  const isCanceled = searchParams.get('canceled') === 'true';

  const handleStripeCheckout = async (pkg: any) => {
    if (!isAuthenticated) {
      router.push('/register');
      return;
    }
    setIsRedirecting(pkg.id);
    try {
      const response = await fetch(`${BACKEND_URL}/api/stripe/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: pkg.stripePriceId,
          userId: user?.id,
          hours: pkg.hours
        }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Neural link failed.');
    } finally { setIsRedirecting(null); }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>;

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-6xl text-center">
        {isCanceled && (
          <div className="max-w-2xl mx-auto mb-12 bg-amber-500/10 border border-amber-500/50 rounded-2xl p-4 flex items-center gap-4">
            <AlertTriangle className="text-amber-500" size={20} />
            <p className="text-amber-200 text-[10px] uppercase tracking-widest font-black">Handshake Canceled. Status unchanged.</p>
          </div>
        )}

        <div className="mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
             <ShieldCheck size={14} className="text-indigo-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Authority Protocol</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 italic uppercase text-white">Nexus <span className="text-indigo-600">Access</span></h1>
          <p className="text-gray-500 max-w-xl mx-auto font-medium text-lg italic">Observers watch; the Nexus commands. Activate your neural link below.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {NEXUS_PASSES.map((pass) => (
            <div key={pass.id} className="group relative bg-zinc-950 border border-white/5 rounded-[2.5rem] p-10 hover:border-indigo-500/50 transition-all duration-500 flex flex-col">
              <div className="flex justify-between items-start mb-12 text-white font-black italic">
                <Clock size={24} className="text-indigo-500" />
                <div className="text-2xl">${pass.price}</div>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">{pass.name}</h3>
              <p className="text-zinc-500 text-sm mb-12 flex-1 leading-relaxed italic">{pass.description}</p>
              <button onClick={() => handleStripeCheckout(pass)} disabled={!!isRedirecting} className="w-full py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3">
                {isRedirecting === pass.id ? <Loader2 size={16} className="animate-spin" /> : <><Zap size={14} /> Acquire Pass</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return <Suspense fallback={<div className="min-h-screen bg-black" />}><PricingContent /></Suspense>;
}
