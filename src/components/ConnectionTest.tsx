"use client";

import { useState } from 'react';
import { testBackendConnection } from '@/lib/api/client';

export default function ConnectionTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing connection to production backend...');
      const response = await testBackendConnection();
      
      if (response.success) {
        setResult(response.data);
        console.log('✅ Production backend connection successful');
      } else {
        setError(response.error || 'Connection failed');
        console.error('❌ Production backend connection failed:', response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Network error: ${errorMessage}. The backend might be spinning up (Render free tier).`);
      console.error('Test connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">Production Backend Connection Test</h3>
      
      <button
        onClick={testConnection}
        disabled={loading}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {loading ? 'Testing Production Backend...' : 'Test Production Backend Connection'}
      </button>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg mb-4">
          <h4 className="text-red-400 font-semibold mb-2">Connection Error</h4>
          <p className="text-red-300 text-sm">{error}</p>
          <p className="text-gray-400 text-xs mt-2">
            Backend URL: <code className="bg-gray-800 px-2 py-1 rounded">https://janusforgenexus-backend.onrender.com</code>
            <br/>
            Note: Render free tier may take 30-60 seconds to spin up if inactive.
          </p>
        </div>
      )}

      {result && (
        <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
          <h4 className="text-green-400 font-semibold mb-2">✅ Production Backend Connected!</h4>
          <pre className="text-gray-300 text-sm whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-400">
        <p>Testing connection to production backend:</p>
        <code className="block bg-gray-800 px-2 py-1 rounded mt-1 text-xs">
          https://janusforgenexus-backend.onrender.com/api/health
        </code>
        <p className="mt-2 text-xs">
          This is the real backend serving your production application.
          All conversations are stored in a professional PostgreSQL database.
        </p>
      </div>
    </div>
  );
}
