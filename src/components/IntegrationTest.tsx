"use client";

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

export default function IntegrationTest() {
  const [results, setResults] = useState<TestResult[]>([
    { name: 'Health Check', status: 'pending', message: 'Testing backend connection...' },
    { name: 'Database Connection', status: 'pending', message: 'Checking database...' },
    { name: 'Authentication', status: 'pending', message: 'Testing auth endpoints...' },
    { name: 'Conversation API', status: 'pending', message: 'Testing conversation endpoints...' },
  ]);
  const [isTesting, setIsTesting] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'pending' | 'success' | 'partial' | 'error'>('pending');

  const runTests = async () => {
    setIsTesting(true);
    setOverallStatus('pending');
    
    // Test 1: Health Check
    setResults(prev => prev.map(r => r.name === 'Health Check' ? {...r, status: 'pending'} : r));
    try {
      const healthResult = await apiClient.healthCheck();
      setResults(prev => prev.map(r => 
        r.name === 'Health Check' 
          ? { 
              ...r, 
              status: healthResult.success ? 'success' : 'error',
              message: healthResult.success ? 'Backend is healthy' : healthResult.error || 'Health check failed',
              data: healthResult.data
            }
          : r
      ));
    } catch (error) {
      setResults(prev => prev.map(r => 
        r.name === 'Health Check' 
          ? { ...r, status: 'error', message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }
          : r
      ));
    }

    // Test 2: Database (via conversations endpoint)
    setResults(prev => prev.map(r => r.name === 'Database Connection' ? {...r, status: 'pending'} : r));
    try {
      const convResult = await apiClient.getConversations(1, 5);
      // Check if we got any data back (doesn't matter if array is empty)
      const hasData = convResult.success && convResult.data !== undefined;
      const dataLength = hasData && Array.isArray(convResult.data) ? convResult.data.length : 0;
      
      setResults(prev => prev.map(r => 
        r.name === 'Database Connection' 
          ? { 
              ...r, 
              status: convResult.success ? 'success' : 'error',
              message: convResult.success 
                ? `Database connected${dataLength > 0 ? ` (${dataLength} conversations)` : ' (no conversations yet)'}`
                : convResult.error || 'Database check failed'
            }
          : r
      ));
    } catch (error) {
      setResults(prev => prev.map(r => 
        r.name === 'Database Connection' 
          ? { ...r, status: 'error', message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }
          : r
      ));
    }

    // Test 3: Authentication (test endpoint availability)
    setResults(prev => prev.map(r => r.name === 'Authentication' ? {...r, status: 'pending'} : r));
    try {
      // Try to access a protected endpoint (should fail with 401 if not authenticated, but that's OK)
      // We just want to see if the endpoint exists
      const response = await fetch('http://localhost:5000/api/auth/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const exists = response.status !== 404;
      setResults(prev => prev.map(r => 
        r.name === 'Authentication' 
          ? { 
              ...r, 
              status: exists ? 'success' : 'error',
              message: exists ? 'Auth endpoints available' : 'Auth endpoints not found'
            }
          : r
      ));
    } catch (error) {
      setResults(prev => prev.map(r => 
        r.name === 'Authentication' 
          ? { ...r, status: 'error', message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }
          : r
      ));
    }

    // Test 4: Conversation API
    setResults(prev => prev.map(r => r.name === 'Conversation API' ? {...r, status: 'pending'} : r));
    try {
      const testConv = await apiClient.createConversation('Test conversation from integration test', 'gpt-4');
      setResults(prev => prev.map(r => 
        r.name === 'Conversation API' 
          ? { 
              ...r, 
              status: testConv.success ? 'success' : 'error',
              message: testConv.success ? 'Conversation API working' : testConv.error || 'Conversation API failed'
            }
          : r
      ));
    } catch (error) {
      setResults(prev => prev.map(r => 
        r.name === 'Conversation API' 
          ? { ...r, status: 'error', message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }
          : r
      ));
    }

    // Calculate overall status
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    if (errorCount === 0) {
      setOverallStatus('success');
    } else if (successCount > 0) {
      setOverallStatus('partial');
    } else {
      setOverallStatus('error');
    }
    
    setIsTesting(false);
  };

  useEffect(() => {
    // Auto-run tests on component mount
    runTests();
  }, []);

  const getStatusColor = (status: TestResult['status'] | typeof overallStatus) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'partial': return 'text-yellow-400';
      case 'pending': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-900/20 border-green-800';
      case 'error': return 'bg-red-900/20 border-red-800';
      case 'pending': return 'bg-blue-900/20 border-blue-800';
      default: return 'bg-gray-900/20 border-gray-800';
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Integration Test</h2>
          <p className="text-gray-400">Testing backend connections and API endpoints</p>
        </div>
        <div className={`px-4 py-2 rounded-full ${getStatusBg(overallStatus as any)}`}>
          <span className={`font-semibold ${getStatusColor(overallStatus)}`}>
            {overallStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getStatusBg(result.status)}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-white">{result.name}</h3>
              <span className={`font-medium ${getStatusColor(result.status)}`}>
                {result.status.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-300 text-sm">{result.message}</p>
            {result.data && (
              <pre className="mt-2 p-2 bg-gray-950 rounded text-xs overflow-x-auto text-gray-400">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={runTests}
          disabled={isTesting}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Run Tests Again'}
        </button>
        
        <button
          onClick={() => window.open('http://localhost:5000/api/health', '_blank')}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
        >
          Open Backend Health
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
        <h4 className="font-semibold text-white mb-2">Backend Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="text-gray-400 w-32">Backend URL:</span>
            <span className="text-gray-300 font-mono">http://localhost:5000</span>
          </div>
          <div className="flex">
            <span className="text-gray-400 w-32">Database:</span>
            <span className="text-gray-300">PostgreSQL (Professional Tier)</span>
          </div>
          <div className="flex">
            <span className="text-gray-400 w-32">Status:</span>
            <span className={`font-medium ${getStatusColor(overallStatus)}`}>
              {overallStatus === 'success' ? 'All systems operational' :
               overallStatus === 'partial' ? 'Partial connectivity' :
               overallStatus === 'error' ? 'Connection issues' :
               'Testing...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
