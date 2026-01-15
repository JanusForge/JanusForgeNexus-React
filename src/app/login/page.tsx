"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { Shield, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { user, login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // 🛡️ THE GATEKEEPER: If the provider says we have a user, GET OUT of the login page.
  useEffect(() => {
    if (user) {
      console.log("Identity Verified. Redirecting to Nexus...");
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Attempt the handshake
    const success = await login(email, password);
    
    if (success) {
       // Force a direct navigation if the useEffect above is too slow
       window.location.href = '/dashboard';
    } else {
       alert("Nexus Authentication Failed. Identity Unknown.");
       setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900/50 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-blue-500/10 rounded-3xl mb-4">
            <Shield className="text-blue-500" size={32} />
          </div>
          <h2 className="text-3xl font-black text-white uppercase italic">Initialize Session</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Architect Email"
            className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Security Key"
            className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={isSubmitting || authLoading}
            className="w-full py-4 bg-blue-600 text-white font-black uppercase rounded-2xl hover:bg-blue-500 transition-all"
          >
            {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Enter Nexus"}
          </button>
        </form>
      </div>
    </div>
  );
}
