'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifySuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000); // Auto-redirect after 5 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-green-800/50 p-10 shadow-2xl shadow-green-900/30">
          <div className="mb-8">
            <div className="inline-block p-4 bg-green-900/30 rounded-full">
              <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-green-400 mb-4">Email Verified!</h1>
          <p className="text-gray-300 mb-8">
            Your Janus Forge account is now activated. You can now sign in and join the council.
          </p>

          <div className="space-y-4">
            <p className="text-gray-400">Redirecting to login in 5 seconds...</p>
            <Link
              href="/login"
              className="inline-block px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-semibold rounded-lg transition-all"
            >
              Go to Login Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
