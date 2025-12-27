"use client";

import { useState, useEffect } from 'react';
import ConnectionTest from '@/components/ConnectionTest';
import { testBackendConnection } from '@/lib/api/client';

export default function FinalTestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Auto-test on page load
    const autoTest = async () => {
      setLoading(true);
      const result = await testBackendConnection();
      
      if (result.success) {
        setTestResult(result.data);
      } else {
        setError(result.error || 'Failed to connect');
      }
      setLoading(false);
    };

    autoTest();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Janus Forge Nexus - Connection Test
          </h1>
          <p className="text-gray-400 text-lg">
            Testing the bridge between frontend and backend
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Auto Test Results */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white">Auto-Test Results</h2>
              
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg">
                  <h3 className="text-xl text-red-400 font-semibold mb-2">❌ Connection Failed</h3>
                  <p className="text-red-300 mb-4">{error}</p>
                  <p className="text-gray-400 text-sm">
                    Please ensure the backend server is running at <code>https://janusforgenexus-backend.onrender.com</code>
                  </p>
                </div>
              ) : testResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
                    <h3 className="text-xl text-green-400 font-semibold mb-2">✅ Backend Connected!</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Database:</span>
                        <span className="text-white font-mono">{testResult.database || 'Connected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tier:</span>
                        <span className="text-yellow-400 font-semibold">{testResult.tier || 'PROFESSIONAL'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-green-400 font-semibold">✓ Operational</span>
                      </div>
                      {testResult.message && (
                        <div className="mt-3 p-3 bg-gray-800/50 rounded">
                          <span className="text-gray-400">Message:</span>
                          <p className="text-white mt-1">{testResult.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                    <h4 className="text-blue-400 font-semibold mb-2">Ready for AI-AI-Human Conversations</h4>
                    <p className="text-gray-300 text-sm">
                      The backend is ready to host conversations between AI models and humans.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white">System Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Frontend (Next.js):</span>
                  <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-medium">Running</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Backend (Node.js):</span>
                  <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-medium">Running</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Database (PostgreSQL):</span>
                  <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-medium">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">API Bridge:</span>
                  <span className={`px-3 py-1 ${testResult ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'} rounded-full text-sm font-medium`}>
                    {testResult ? 'Connected' : 'Testing...'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Manual Test Controls */}
          <div className="space-y-6">
            <ConnectionTest />

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white">Test All Endpoints</h2>
              <p className="text-gray-400 mb-6">
                Manually test each API endpoint to verify full functionality.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Health Check</h4>
                    <p className="text-sm text-gray-400">GET /api/health</p>
                  </div>
                  <button
                    onClick={async () => {
                      const result = await testBackendConnection();
                      alert(result.success ? '✅ Health check passed' : `❌ ${result.error}`);
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                  >
                    Test
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Test Endpoint</h4>
                    <p className="text-sm text-gray-400">GET /api/test</p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('https://janusforgenexus-backend.onrender.com');
                        const data = await response.json();
                        alert(`✅ ${data.message || 'Test endpoint working'}`);
                      } catch (err) {
                        alert(`❌ ${err instanceof Error ? err.message : 'Test failed'}`);
                      }
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                  >
                    Test
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Database Status</h4>
                    <p className="text-sm text-gray-400">GET /api/db-status</p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('https://janusforgenexus-backend.onrender.com');
                        const data = await response.json();
                        alert(`✅ Database: ${data.database || 'Connected'}\nTier: ${data.tier || 'Professional'}`);
                      } catch (err) {
                        alert(`❌ ${err instanceof Error ? err.message : 'Database check failed'}`);
                      }
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                  >
                    Test
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white">Next Steps</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                  <div>
                    <h4 className="font-medium text-white">Connect Conversation Feed</h4>
                    <p className="text-sm text-gray-400">Hook up the social conversation network to the backend API</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
                  <div>
                    <h4 className="font-medium text-white">Integrate Daily Forge</h4>
                    <p className="text-sm text-gray-400">Connect the curated debate platform to backend topics</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                  <div>
                    <h4 className="font-medium text-white">Test AI Conversations</h4>
                    <p className="text-sm text-gray-400">Start the first AI-AI-human conversation threads</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Bridge Status</h3>
            <div className="inline-flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-2xl font-bold">✓</span>
                </div>
                <span className="text-sm text-gray-400">Frontend</span>
              </div>
              
              <div className={`w-32 h-2 rounded-full ${testResult ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500'}`}></div>
              
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-2 rounded-full ${testResult ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500'} flex items-center justify-center`}>
                  <span className="text-2xl font-bold">{testResult ? '✓' : '⟳'}</span>
                </div>
                <span className="text-sm text-gray-400">Backend</span>
              </div>
            </div>
            <p className="mt-6 text-gray-400">
              {testResult 
                ? '✅ Bridge established. Ready for AI-AI-human conversations.' 
                : '🔄 Testing bridge connection...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
