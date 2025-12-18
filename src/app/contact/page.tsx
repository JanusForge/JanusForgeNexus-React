export default function ContactPage() {
  const contactCategories = [
    {
      title: "General & Support",
      description: "For general inquiries, technical support, and waitlist information",
      contacts: [
        { label: "General Inquiries & Support", email: "support@janusforge.ai" },
        { label: "Waitlist Inquiries", email: "waitlist@janusforge.ai" },
      ],
      color: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-500/20",
      icon: "💬"
    },
    {
      title: "Business & Partnerships",
      description: "For sales, partnerships, and media inquiries",
      contacts: [
        { label: "Sales & Major Accounts", email: "sales@janusforge.ai" },
        { label: "Major Accounts (Direct)", email: "major-accounts@janusforge.ai" },
        { label: "Partnerships", email: "partnerships@janusforge.ai" },
        { label: "Press & Media", email: "press@janusforge.ai" },
      ],
      color: "from-purple-500/10 to-pink-500/10",
      border: "border-purple-500/20",
      icon: "🤝"
    },
    {
      title: "Administrative & Legal",
      description: "For legal matters and executive communications",
      contacts: [
        { label: "Legal Department", email: "legal@janusforge.ai" },
        { label: "Executive Office", email: "cassandra@janusforge.ai" },
      ],
      color: "from-amber-500/10 to-orange-500/10",
      border: "border-amber-500/20",
      icon: "⚖️"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Contact Janus Forge Nexus
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Get in touch with the right team for your inquiry. We're here to help.
          </p>
        </div>

        {/* Contact Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {contactCategories.map((category, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-br ${category.color} backdrop-blur-sm rounded-2xl p-6 border ${category.border} shadow-xl`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{category.icon}</span>
                <h2 className="text-xl font-bold text-white">{category.title}</h2>
              </div>
              <p className="text-gray-300 mb-6">{category.description}</p>
              
              <div className="space-y-4">
                {category.contacts.map((contact, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-gray-900/50 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition-all"
                  >
                    <p className="text-sm text-gray-400 mb-1">{contact.label}</p>
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-lg font-mono text-blue-300 hover:text-blue-200 transition-colors break-all"
                    >
                      {contact.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Response Guidelines */}
        <div className="max-w-4xl mx-auto bg-gray-800/30 rounded-2xl p-8 border border-gray-700/50">
          <h3 className="text-2xl font-bold mb-6 text-white">Response Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-4 text-blue-300 flex items-center gap-2">
                <span>⏱️</span> Expected Response Times
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span><strong>Support:</strong> Within 24-48 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span><strong>Sales:</strong> Within 1 business day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span><strong>Legal:</strong> Within 2-3 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Partnerships:</strong> Within 3-5 business days</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-green-300 flex items-center gap-2">
                <span>📋</span> Contact Tips
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Use the appropriate email address for your inquiry</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Include relevant details in your first message</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Check our FAQ and documentation first</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>For urgent matters, include "URGENT" in subject line</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 mb-2">
            Janus Forge Accelerators LLC
          </p>
          <p className="text-gray-500 text-sm">
            A Kentucky Limited Liability Company • Doing Business As: Janus Forge Nexus
          </p>
          <p className="text-gray-500 text-sm mt-4">
            © {new Date().getFullYear()} Janus Forge Nexus. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
