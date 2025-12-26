'use client';

import { useState, useEffect } from 'react';
import apiClient, { API_ENDPOINTS } from '@/lib/api';

interface TestResult {
  name: string;
  status: string;
  details: string;
  success: boolean;
}

export default function IntegrationTest() {
  const [status, setStatus] = useState<string>('Testing backend connection...');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setIsTesting(true);
    setStatus('Running tests...');
    
    const tests = [
      {
        name: 'Health Check',
        test: async () => {
          const data = await apiClient.get(API_ENDPOINTS.health);
          return {
            success: data.status === 'healthy',
            details: `Database: ${data.database}, Users: ${data.statistics?.users}`
          };
        }
      },
      {
        name: 'Tiers',
        test: async () => {
          const data = await apiClient.get(API_ENDPOINTS.tiers);
          return {
            success: data.success && data.tiers?.length === 4,
            details: `${data.tiers?.length} tiers loaded`
          };
        }
      },
      {
        name: 'Conversations',
        test: async () => {
          const data = await apiClient.get(API_ENDPOINTS.conversations);
          return {
            success: data.success,
            details: `${data.conversations?.length} conversations loaded`
          };
        }
      },
      {
        name: 'Daily Forge',
        test: async () => {
          const data = await apiClient.get(API_ENDPOINTS.dailyForge.current);
          return {
            success: data.success,
            details: `Topic: ${data.topic?.title?.substring(0, 50)}...`
          };
        }
      },
      {
        name: 'Registration',
        test: async () => {
          const timestamp = Date.now();
          const data = await apiClient.post(API_ENDPOINTS.auth.register, {
            email: `test_${timestamp}@janusforge.ai`,
            username: `testuser_${timestamp}`,
            password: 'Test123!'
          });
          return {
            success: data.success,
            details: `User: ${data.user?.username}`
          };
        }
      },
    ];

    const testResults: TestResult[] = [];
    
    for (const test of tests) {
      try {
        const result = await test.test();
        testResults.push({
          name: test.name,
          status: result.success ? '✅ Success' : '❌ Failed',
          details: result.details,
          success: result.success
        });
      } catch (error: any) {
        testResults.push({
          name: test.name,
          status: '❌ Connection Failed',
          details: error.message,
          success: false
        });
      }
    }

    setResults(testResults);
    const allPassed = testResults.every(r => r.success);
    setIsConnected(allPassed);
    setStatus(allPassed ? '✅ Backend connected!' : '⚠️ Some connections failed');
    setIsTesting(false);
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl border border-purple-500/30 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Backend Integration Test</h2>
      
      <div className={`p-4 rounded-lg mb-6 ${isConnected ? 'bg-green-900/30 border border-green-500' : isTesting ? 'bg-yellow-900/30 border border-yellow-500' : 'bg-red-900/30 border border-red-500'}`}>
        <p className="font-mono text-lg">{status}</p>
        <p className="text-sm opacity-80 mt-2">Backend URL: http://localhost:5000</p>
        
        <button
          onClick={testConnection}
          disabled={isTesting}
          className={`mt-3 px-4 py-2 rounded font-medium ${isTesting ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
        >
          {isTesting ? 'Testing...' : 'Test Again'}
        </button>
      </div>

      <div className="space-y-3">
        {results.map((result, index) => (
          <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-white">{result.name}</span>
              <span className={`px-2 py-1 rounded text-xs ${result.status.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {result.status}
              </span>
            </div>
            <p className="text-sm text-gray-300 mt-1">{result.details}</p>
          </div>
        ))}
      </div>

      {isConnected && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/50 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-2">🎉 Ready for Development!</h3>
          <p className="text-purple-300 mb-3">
            Your backend is fully connected. You can now implement:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="p-3 bg-black/30 rounded">
              <h4 className="font-semibold text-white">🤖 AI Conversations</h4>
              <p className="text-sm text-gray-300">Twitter-like feed with AI-human interactions</p>
            </div>
            <div className="p-3 bg-black/30 rounded">
              <h4 className="font-semibold text-white">🔥 Daily Forge</h4>
              <p className="text-sm text-gray-300">Structured AI council debates</p>
            </div>
            <div className="p-3 bg-black/30 rounded">
              <h4 className="font-semibold text-white">💰 Tier System</h4>
              <p className="text-sm text-gray-300">Free/Basic/Pro/Enterprise access levels</p>
            </div>
            <div className="p-3 bg-black/30 rounded">
              <h4 className="font-semibold text-white">🔐 Authentication</h4>
              <p className="text-sm text-gray-300">User registration and login</p>
            </div>
          </div>
        </div>
      )}

      {!isConnected && results.length > 0 && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-2">⚠️ Connection Issues</h3>
          <p className="text-red-300">
            Make sure your backend is running:
          </p>
          <pre className="mt-2 p-2 bg-black/50 text-sm text-gray-300 rounded overflow-x-auto">
            cd ~/JanusForgeNexus-Backend{'\n'}
            node server-fixed.js
          </pre>
        </div>
      )}
    </div>
  );
}
