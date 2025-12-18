export function createPageContent(title, description, section, extraContent = '') {
  const sections = {
    'Resources': {
      bg: 'from-blue-950/50 via-gray-900 to-gray-950',
      gradient: 'from-blue-400 to-cyan-300',
      icon: '📚'
    },
    'Experience AI Debates': {
      bg: 'from-purple-950/50 via-gray-900 to-gray-950',
      gradient: 'from-purple-400 to-pink-300',
      icon: '🧠'
    },
    'Join the Conversation': {
      bg: 'from-green-950/50 via-gray-900 to-gray-950',
      gradient: 'from-green-400 to-emerald-300',
      icon: '💬'
    }
  };

  const sectionData = sections[section] || sections['Resources'];

  return `
import Link from 'next/link';

export default function ${title.replace(/\s+/g, '').replace(/&/g, 'And')}Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b ${sectionData.bg}">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${sectionData.gradient} mb-6">
            <span className="text-3xl">${sectionData.icon}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r ${sectionData.gradient} bg-clip-text text-transparent">
            ${title}
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            ${description}
          </p>
          <div className="inline-flex px-4 py-2 bg-gradient-to-r ${sectionData.gradient}/10 rounded-xl border ${sectionData.gradient}/20">
            <span className="text-sm font-semibold ${sectionData.gradient.replace('from-', 'text-').replace(' to-', '-')}">
              ${section}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          ${extraContent}
        </div>

        {/* Back Link */}
        <div className="mt-16 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700/50 transition-colors"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
`;
}
