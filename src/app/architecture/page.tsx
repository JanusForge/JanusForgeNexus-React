import { Code, Database, Cpu, Server, Layers, GitBranch, Shield } from 'lucide-react';
import ArchitectureDiagram from '@/components/Architecture/ArchitectureDiagram';

export default function ArchitecturePage() {
  const techStack = [
    {
      category: 'Frontend',
      icon: Code,
      items: [
        { name: 'Next.js 14', description: 'App Router, Server Components' },
        { name: 'TypeScript', description: 'Type safety at scale' },
        { name: 'Tailwind CSS', description: 'Utility-first styling' },
        { name: 'Framer Motion', description: 'Advanced animations' },
        { name: 'React Query', description: 'Data fetching & caching' },
      ]
    },
    {
      category: 'Backend',
      icon: Server,
      items: [
        { name: 'Python FastAPI', description: 'High-performance API' },
        { name: 'Council Memory System', description: 'Conversation persistence' },
        { name: 'AI Tier Manager', description: 'Subscription logic' },
        { name: 'Session Management', description: 'User conversation state' },
      ]
    },
    {
      category: 'AI Integration',
      icon: Cpu,
      items: [
        { name: 'Grok (xAI)', description: 'Provocateur model' },
        { name: 'Gemini (Google)', description: 'Creative model' },
        { name: 'DeepSeek', description: 'Analyst model' },
        { name: 'Claude (Anthropic)', description: 'Ethicist model' },
        { name: 'GPT-4 (OpenAI)', description: 'Generalist model' },
      ]
    },
    {
      category: 'Infrastructure',
      icon: Layers,
      items: [
        { name: 'Railway', description: 'Backend deployment' },
        { name: 'Vercel', description: 'Frontend deployment' },
        { name: 'PostgreSQL', description: 'Primary database' },
        { name: 'Redis', description: 'Session caching' },
      ]
    },
    {
      category: 'Security',
      icon: Shield,
      items: [
        { name: 'API Key Encryption', description: 'Zero plaintext storage' },
        { name: 'CORS Configuration', description: 'Domain protection' },
        { name: 'Rate Limiting', description: 'Per-tier API limits' },
        { name: 'Input Sanitization', description: 'Prompt safety' },
      ]
    },
  ];

  const dataFlow = [
    {
      step: 1,
      title: 'User Input',
      description: 'User submits message with subscription tier',
      tech: ['React Form', 'WebSocket']
    },
    {
      step: 2,
      title: 'API Gateway',
      description: 'FastAPI routes request to appropriate endpoint',
      tech: ['FastAPI', 'CORS', 'Rate Limiter']
    },
    {
      step: 3,
      title: 'Tier Validation',
      description: 'AITierManager checks user subscription level',
      tech: ['AITierManager', 'PostgreSQL']
    },
    {
      step: 4,
      title: 'Context Assembly',
      description: 'CouncilMemory retrieves conversation history',
      tech: ['CouncilMemory', 'Redis Cache']
    },
    {
      step: 5,
      title: 'AI Dispatch',
      description: 'Parallel API calls to 5 AI providers',
      tech: ['asyncio', 'httpx', 'API Clients']
    },
    {
      step: 6,
      title: 'Response Synthesis',
      description: 'Responses formatted with personality styling',
      tech: ['Response Formatter', 'Markdown Parser']
    },
    {
      step: 7,
      title: 'Memory Update',
      description: 'New messages added to conversation memory',
      tech: ['CouncilMemory', 'PostgreSQL']
    },
    {
      step: 8,
      title: 'Real-time Delivery',
      description: 'WebSocket push to frontend',
      tech: ['WebSocket', 'React Query']
    },
  ];

  const projectStructure = [
    {
      type: 'Root',
      path: '/',
      children: [
        'package.json',
        'README.md',
        'LICENSE',
        '.env.example'
      ]
    },
    {
      type: 'Source',
      path: '/src',
      children: [
        {
          path: '/app',
          type: 'Next.js App Router',
          children: [
            '(landing)/ - Marketing pages',
            '(app)/ - Protected routes',
            'api/ - Edge functions',
            'layout.tsx - Root layout',
            'page.tsx - Homepage'
          ]
        },
        {
          path: '/components',
          type: 'React Components',
          children: [
            'Brand/ - Logo, badges',
            'DailyForge/ - Countdown, topics',
            'Chat/ - Conversation UI',
            'Layout/ - Header, footer',
            'UI/ - Reusable components'
          ]
        },
        {
          path: '/lib',
          type: 'Utilities',
          children: [
            'api/ - API client',
            'stores/ - State management',
            'utils/ - Helpers'
          ]
        },
        {
          path: '/types',
          type: 'TypeScript',
          children: ['index.ts - Type definitions']
        }
      ]
    },
    {
      type: 'Backend',
      path: '/backend',
      children: [
        'server.py - FastAPI server',
        'ai_tiers.py - Subscription logic',
        'requirements.txt - Python deps',
        '.env - API keys'
      ]
    },
    {
      type: 'Public',
      path: '/public',
      children: ['logos/', 'fonts/', 'favicon.ico']
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
              System Architecture
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transparent technical overview of Janus Forge Nexus. Built for scalability, security, and real-time multi-AI conversations.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-gray-900/50 rounded-full mt-6">
            <GitBranch className="w-4 h-4 mr-2 text-green-400" />
            <span className="text-sm text-gray-300">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">High-Level Architecture</h2>
            <div className="text-sm text-gray-400">
              <span className="inline-flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Live Production System
              </span>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
            <ArchitectureDiagram />
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-900/30 rounded-lg">
                <div className="text-sm text-gray-400">Frontend</div>
                <div className="font-bold text-white">Vercel</div>
              </div>
              <div className="p-4 bg-gray-900/30 rounded-lg">
                <div className="text-sm text-gray-400">Backend</div>
                <div className="font-bold text-white">Railway</div>
              </div>
              <div className="p-4 bg-gray-900/30 rounded-lg">
                <div className="text-sm text-gray-400">Database</div>
                <div className="font-bold text-white">PostgreSQL</div>
              </div>
              <div className="p-4 bg-gray-900/30 rounded-lg">
                <div className="text-sm text-gray-400">Cache</div>
                <div className="font-bold text-white">Redis</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8">Technology Stack</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((category) => (
              <div key={category.category} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <category.icon className="w-5 h-5 text-orange-400 mr-3" />
                  <h3 className="font-bold text-white">{category.category}</h3>
                </div>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li key={item.name} className="text-sm">
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-gray-400">{item.description}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Data Flow */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8">Data Flow & Processing</h2>
          <div className="space-y-4">
            {dataFlow.map((step) => (
              <div key={step.step} className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold text-sm">{step.step}</span>
                </div>
                <div className="flex-grow bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 mb-4">{step.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.tech.map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Structure */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Project Structure</h2>
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
            <div className="font-mono text-sm space-y-4">
              {projectStructure.map((section) => (
                <div key={section.path}>
                  <div className="text-orange-400 font-bold mb-2">
                    {section.path}/
                  </div>
                  <div className="ml-4 space-y-1">
                    {section.children.map((child, idx) => (
                      <div key={idx} className="text-gray-300">
                        {typeof child === 'string' ? (
                          <span className="text-green-400">📄 {child}</span>
                        ) : (
                          <>
                            <div className="text-blue-400 font-bold">
                              📁 {child.path}/
                            </div>
                            <div className="ml-4">
                              {child.children.map((subchild, subidx) => (
                                <div key={subidx} className="text-gray-300">
                                  📄 {subchild}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GitHub Link */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl transition-colors">
            <GitBranch className="w-5 h-5 mr-3" />
            <span className="font-medium">Full source code available to enterprise clients</span>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Contact partnerships@janusforgenexus.com for repository access
          </p>
        </div>
      </div>
    </div>
  );
}
