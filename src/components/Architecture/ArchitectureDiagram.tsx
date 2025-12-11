'use client';

import { motion } from 'framer-motion';
import { Globe, Smartphone, Server, Cpu, Database, Cloud } from 'lucide-react';

export default function ArchitectureDiagram() {
  const nodes = [
    {
      id: 'user',
      name: 'User Browser',
      icon: Smartphone,
      color: 'from-blue-500 to-cyan-500',
      position: 'left'
    },
    {
      id: 'vercel',
      name: 'Vercel Frontend',
      icon: Globe,
      color: 'from-purple-500 to-pink-500',
      position: 'left'
    },
    {
      id: 'railway',
      name: 'Railway Backend',
      icon: Server,
      color: 'from-orange-500 to-red-500',
      position: 'center'
    },
    {
      id: 'ai',
      name: 'AI APIs',
      icon: Cpu,
      color: 'from-green-500 to-emerald-500',
      position: 'right',
      subnodes: ['Grok', 'Gemini', 'DeepSeek', 'Claude', 'GPT-4']
    },
    {
      id: 'db',
      name: 'PostgreSQL',
      icon: Database,
      color: 'from-indigo-500 to-blue-500',
      position: 'right'
    },
    {
      id: 'redis',
      name: 'Redis Cache',
      icon: Cloud,
      color: 'from-red-500 to-orange-500',
      position: 'right'
    }
  ];

  const connections = [
    { from: 'user', to: 'vercel', label: 'HTTPS' },
    { from: 'vercel', to: 'railway', label: 'API Calls' },
    { from: 'railway', to: 'ai', label: 'AI Requests' },
    { from: 'railway', to: 'db', label: 'Queries' },
    { from: 'railway', to: 'redis', label: 'Cache' },
    { from: 'ai', to: 'railway', label: 'AI Responses' }
  ];

  return (
    <div className="relative h-96">
      {/* Connections */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((conn, idx) => (
          <motion.line
            key={idx}
            x1={conn.from === 'user' ? '10%' : conn.from === 'vercel' ? '30%' : '50%'}
            y1={conn.from === 'user' ? '25%' : conn.from === 'vercel' ? '25%' : '50%'}
            x2={conn.to === 'ai' ? '90%' : conn.to === 'db' ? '70%' : conn.to === 'redis' ? '70%' : '50%'}
            y2={conn.to === 'ai' ? '50%' : conn.to === 'db' ? '75%' : conn.to === 'redis' ? '25%' : '50%'}
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: idx * 0.2 }}
          />
        ))}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Nodes */}
      {nodes.map((node, idx) => (
        <motion.div
          key={node.id}
          className={`absolute ${
            node.position === 'left' ? 'left-0' :
            node.position === 'center' ? 'left-1/2 -translate-x-1/2' :
            'right-0'
          } ${
            node.id === 'user' || node.id === 'redis' ? 'top-1/4' :
            node.id === 'vercel' || node.id === 'db' ? 'top-3/4' :
            'top-1/2 -translate-y-1/2'
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.3 }}
        >
          <div className={`bg-gradient-to-br ${node.color} p-1 rounded-2xl shadow-2xl`}>
            <div className="bg-gray-900 rounded-xl p-6 w-48">
              <div className="flex items-center justify-center mb-4">
                <node.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-white text-center mb-2">{node.name}</h3>
              
              {node.subnodes && (
                <div className="mt-3 space-y-1">
                  {node.subnodes.map((subnode, subidx) => (
                    <div
                      key={subidx}
                      className="text-xs text-gray-300 text-center px-2 py-1 bg-gray-800/50 rounded"
                    >
                      {subnode}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-6 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-gradient-to-r from-orange-500 to-purple-600 mr-2"></div>
          <span className="text-gray-400">API Connection</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mr-2"></div>
          <span className="text-gray-400">Service Node</span>
        </div>
      </div>
    </div>
  );
}
