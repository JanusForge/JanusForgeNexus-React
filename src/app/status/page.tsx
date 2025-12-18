"use client";

import { useState, useEffect } from 'react';

export default function StatusPage() {
  const [services, setServices] = useState([
    { name: 'API Service', status: 'operational', lastUpdated: 'Just now' },
    { name: 'Database', status: 'operational', lastUpdated: '5 minutes ago' },
    { name: 'AI Model Gateway', status: 'operational', lastUpdated: '2 minutes ago' },
    { name: 'Payment Processing', status: 'operational', lastUpdated: '1 hour ago' },
    { name: 'WebSocket Server', status: 'operational', lastUpdated: '15 minutes ago' },
  ]);

  const [lastChecked, setLastChecked] = useState('Just now');

  useEffect(() => {
    const interval = setInterval(() => {
      setLastChecked('Just now');
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'operational': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'operational': return '🟢';
      case 'degraded': return '🟡';
      case 'down': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">System Status</h1>
            <div className="text-sm text-gray-400">
              Last checked: {lastChecked}
            </div>
          </div>
          
          {/* Status Overview */}
          <div className="bg-gray-800/30 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <h2 className="text-2xl font-bold text-green-400">All Systems Operational</h2>
            </div>
            <p className="text-gray-300">
              All services are running normally. No incidents reported.
            </p>
          </div>
          
          {/* Services List */}
          <div className="bg-gray-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-6">Service Status</h3>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{getStatusIcon(service.status)}</span>
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-gray-400">Updated {service.lastUpdated}</p>
                    </div>
                  </div>
                  <span className={`font-medium ${getStatusColor(service.status)}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Incident History */}
          <div className="bg-gray-800/30 rounded-xl p-6 mt-8">
            <h3 className="text-xl font-bold mb-6">Recent Incidents</h3>
            <p className="text-gray-400 text-center py-4">
              No incidents in the last 90 days.
            </p>
          </div>
          
          <div className="mt-8">
            <a href="/" className="text-blue-400 hover:text-blue-300">
              ← Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
