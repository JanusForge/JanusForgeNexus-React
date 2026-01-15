"use client";
import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user; // Deriving authentication status
  const router = useRouter();

  // Redirect if not authenticated or not GOD_MODE
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'GOD_MODE')) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'GOD_MODE') {
    return null; // Redirect will handle
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-8">Janus Forge Admin Panel</h1>
        <p className="text-gray-400">Welcome, Architect. God Mode active.</p>
        {/* Add your admin tools here */}
      </div>
    </div>
  );
}
