"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Backend:</span>
                <span className="text-green-400">✅ Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Database:</span>
                <span className="text-green-400">✅ Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Frontend:</span>
                <span className="text-green-400">✅ Running</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                onClick={() => window.open('https://dashboard.render.com', '_blank')}
              >
                View Backend Logs (Render)
              </button>
              <button 
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                onClick={() => window.open('https://vercel.com/janusforge/janusforge-nexus-react', '_blank')}
              >
                View Frontend Logs (Vercel)
              </button>
              <button 
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                onClick={() => window.open('https://janusforgenexus-backend.onrender.com/api/health', '_blank')}
              >
                Check API Health
              </button>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Production Environment</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400">Backend URL</div>
                <div className="text-white font-mono text-sm truncate">https://janusforgenexus-backend.onrender.com</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Frontend URL</div>
                <div className="text-white font-mono text-sm truncate">https://janusforge.ai</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Database</div>
                <div className="text-white">Professional PostgreSQL</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-900/30 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Real-time Statistics</h2>
          <div className="text-center p-8">
            <p className="text-gray-400">
              Real user statistics will appear here as people use the platform.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              No mock data - waiting for real users to interact with the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
