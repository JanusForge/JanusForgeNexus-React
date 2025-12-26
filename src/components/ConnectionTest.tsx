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
      console.log('Testing connection to backend...');
      const response = await testBackendConnection();
      
      if (response.success) {
        setResult(response.data);
        console.log('Backend connection successful:', response.data);
      } else {
        setError(response.error || 'Connection failed');
        console.error('Backend connection failed:', response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Test connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">Backend Connection Test</h3>
      
      <button
        onClick={testConnection}
        disabled={loading}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {loading ? 'Testing...' : 'Test Backend Connection'}
      </button>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg mb-4">
          <h4 className="text-red-400 font-semibold mb-2">Connection Error</h4>
          <p className="text-red-300 text-sm">{error}</p>
          <p className="text-gray-400 text-xs mt-2">
            Make sure the backend is running at <code>http://localhost:5000</code>
          </p>
        </div>
      )}

      {result && (
        <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
          <h4 className="text-green-400 font-semibold mb-2">✅ Connection Successful!</h4>
          <pre className="text-gray-300 text-sm whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-400">
        <p>Testing connection to: <code className="bg-gray-800 px-2 py-1 rounded">http://localhost:5000/api/health</code></p>
      </div>
    </div>
  );
}
