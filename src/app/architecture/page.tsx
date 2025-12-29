"use client";

// Added ChevronRight and CheckCircle to the list
import { 
  Zap, 
  LayoutGrid, 
  Server, 
  Database, 
  Brain, 
  Users, 
  Cloud, 
  Network, 
  Bot, 
  CheckCircle, 
  ChevronRight 
} from 'lucide-react';
import Link from 'next/link';


export default function ArchitecturePage() {
  const sections = [
    {
      id: 'overview',
      title: 'The Nexus Architecture: A Living Forge',
      description: 'The Janus Forge Nexus is engineered as an intelligent ecosystem, enabling adversarial AI collaboration. From user input to the final Council decree, every component is optimized for speed, scalability, and transparent discourse.',
      icon: <LayoutGrid className="text-blue-400" />,
      flow: [
        { title: 'Architect Input', desc: 'User poses challenge to the Council.' },
        { title: 'Frontend (Next.js)', desc: 'Web UI, real-time chat, authentication.' },
        { title: 'Backend (Node.js)', desc: 'API gateway, Socket.io for real-time comms, business logic.' },
        { title: 'AI Orchestration', desc: 'Routes query to Council, manages debate flow.' },
        { title: 'AI Council (Grok, Claude, DeepSeek)', desc: 'Individual models process input, generate responses, critique peers.' },
        { title: 'Data Persistence (Neon DB)', desc: 'Stores conversation history, user data, token usage.' },
        { title: 'Consensus/Decree', desc: 'Backend synthesizes AI responses into a final output for the user.' },
      ]
    },
    {
      id: 'frontend',
      title: 'Frontend: The User\'s Command Center',
      description: 'Built with Next.js and React, the frontend delivers a responsive, real-time experience. It acts as the primary interface for Architects to engage the Nexus.',
      icon: <Users className="text-purple-400" />,
      features: [
        'Real-time Chat with Socket.io',
        'User Authentication (NextAuth.js)',
        'Dynamic UI for AI-to-AI Debates',
        'Share & Export Functionality (PDF, DOCX)',
      ]
    },
    {
      id: 'backend',
      title: 'Backend: The Nexus Forge',
      description: 'The Node.js backend serves as the operational heart, handling API requests, managing real-time data flow, and orchestrating the AI Council\'s interactions.',
      icon: <Server className="text-green-400" />,
      features: [
        'Express.js API Gateway',
        'Socket.io for Bidirectional Communication',
        'Nodemailer for Email Services',
        'Token Management & Usage Tracking',
      ]
    },
    {
      id: 'ai-orchestration',
      title: 'AI Orchestration: The Debate Conductor',
      description: 'This custom layer manages the asynchronous, multi-agent interactions between Grok, Claude, and DeepSeek, ensuring a structured, yet dynamic debate.',
      icon: <Network className="text-yellow-400" />,
      features: [
        'Parallel AI Querying',
        'Response Sequencing & Critique Routing',
        'Dynamic Persona Management',
        'Consensus & Verdict Generation Logic',
      ]
    },
    {
      id: 'data',
      title: 'Data Persistence: The Memory of the Nexus',
      description: 'Utilizing Neon (PostgreSQL-compatible), the database stores every session, ensuring transparent record-keeping and robust user management.',
      icon: <Database className="text-pink-400" />,
      features: [
        'Conversation History & Decrees',
        'User Profiles & Authentication',
        'Token Balances & Usage Logs',
        'Scalable & Serverless Architecture',
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Zap size={10} /> The Foundry Specs
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent uppercase">
          Nexus <span className="text-blue-500">Architecture</span>
        </h1>
        <p className="text-gray-400 text-lg font-bold italic">
          "The engine behind the Council. Engineered for adversarial brilliance."
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-20">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="bg-gray-900/40 border border-white/5 p-8 rounded-[3rem] shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/5 inline-block rounded-xl">
                {section.icon}
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">{section.title}</h2>
            </div>
            <p className="text-gray-400 text-base leading-relaxed mb-8">{section.description}</p>

            {/* Flow Diagram (only for overview) */}
            {section.flow && (
              <div className="relative border-l-2 border-blue-600 pl-6 space-y-8 mt-12 mb-8">
                {section.flow.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-7 top-0 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <ChevronRight className="w-3 h-3 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                    <p className="text-gray-300 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Features List (for other sections) */}
            {section.features && (
              <ul className="grid md:grid-cols-2 gap-4 mt-8">
                {section.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 bg-gray-800/60 p-4 rounded-xl border border-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-200 text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="p-12 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-[3rem] border border-white/10">
          <h2 className="text-2xl font-black uppercase mb-4">Explore the Foundry</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Understanding the architecture reveals the strength of the Nexus. Dive deeper into the code, 
            contribute to its evolution, or simply witness the power of a truly intelligent ecosystem.
          </p>
          <Link href="/" className="inline-block px-8 py-4 bg-white text-black font-black text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all">
            ENGAGE THE COUNCIL
          </Link>
        </div>
      </div>
    </div>
  );
}
