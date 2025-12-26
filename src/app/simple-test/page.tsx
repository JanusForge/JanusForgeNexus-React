'use client';

import { useEffect, useState } from 'react';

export default function SimpleTestPage() {
  const [status, setStatus] = useState('Testing...');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    testBackend();
  }, []);

  const testBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const result = await response.json();
      setData(result);
      setStatus('✅ Connected to Backend!');
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-gray-900 rounded-xl p-8 border border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Simple Connection Test
        </h1>
        
        <div className="mb-6">
          <div className="text-gray-400 mb-2">Backend Status:</div>
          <div className={`text-lg font-medium ${status.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
            {status}
          </div>
        </div>
        
        {data && (
          <div className="mb-6">
            <div className="text-gray-400 mb-2">Response:</div>
            <pre className="text-sm text-gray-300 bg-gray-800 p-4 rounded-lg overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={testBackend}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Test Again
          </button>
          
          <a
            href="/working-test"
            className="block w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center transition-colors"
          >
            Go to Working Test
          </a>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>Backend: localhost:5000</p>
          <p>Frontend: localhost:3000</p>
        </div>
      </div>
    </div>
  );
}
