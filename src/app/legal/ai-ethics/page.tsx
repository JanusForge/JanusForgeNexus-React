export default function AiethicsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            AI Ethics Policy
          </h1>
          <p className="text-gray-400 text-lg">
            Policy Statement Effective Date: December 18, 2025
          </p>
          <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
            <p className="text-sm">
              Our commitment to developing and deploying AI technology responsibly, safely, and beneficially.
            </p>
          </div>
        </div>

        {/* Our Commitment */}
        <section className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 p-8 rounded-2xl border border-green-500/20 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🧭</div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-green-300">Our Commitment</h2>
              <p className="text-lg">
                At Janus Forge Nexus, we are committed to developing and deploying AI technology responsibly. 
                This Ethics Policy outlines our core principles in the pursuit of powerful, safe, and beneficial AI.
              </p>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Core Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Human-Centricity & Benefit",
                desc: "Our AI is designed to augment human capability and decision-making. We strive to create tools that have a net-positive impact on society.",
                icon: "👥",
                color: "from-blue-500/10 to-indigo-500/10",
                border: "border-blue-500/20"
              },
              {
                title: "Fairness & Bias Mitigation",
                desc: "We actively work to identify and reduce unfair biases in our AI models and datasets throughout the development lifecycle.",
                icon: "⚖️",
                color: "from-purple-500/10 to-pink-500/10",
                border: "border-purple-500/20"
              },
              {
                title: "Transparency & Explainability",
                desc: "We are committed to clarity about our technology's capabilities, limitations, and intended use cases.",
                icon: "🔍",
                color: "from-amber-500/10 to-orange-500/10",
                border: "border-amber-500/20"
              },
              {
                title: "Privacy & Data Stewardship",
                desc: "We uphold strict data privacy standards. We believe users should have control over their data.",
                icon: "🛡️",
                color: "from-green-500/10 to-emerald-500/10",
                border: "border-green-500/20"
              },
              {
                title: "Safety, Security & Robustness",
                desc: "We prioritize building safe, secure, and reliable AI systems that are resilient to misuse.",
                icon: "🔒",
                color: "from-red-500/10 to-rose-500/10",
                border: "border-red-500/20"
              },
              {
                title: "Accountability",
                desc: "We maintain clear lines of responsibility for our AI systems and address unintended consequences.",
                icon: "📋",
                color: "from-cyan-500/10 to-teal-500/10",
                border: "border-cyan-500/20"
              }
            ].map((principle, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${principle.color} backdrop-blur-sm rounded-xl p-6 border ${principle.border}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{principle.icon}</span>
                  <h3 className="text-xl font-bold text-white">{principle.title}</h3>
                </div>
                <p className="text-gray-300">{principle.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Implementation & Governance */}
        <section className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800/50 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-cyan-300">Implementation & Governance</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-cyan-300">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Ethical Reviews</h3>
                <p className="text-gray-400">Our development process includes ethical review checkpoints at each stage.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-cyan-300">🎓</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Training & Education</h3>
                <p className="text-gray-400">Our team receives regular training on AI ethics and responsible innovation.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-cyan-300">🤝</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Collaboration</h3>
                <p className="text-gray-400">We engage with the broader AI community, researchers, and policymakers.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-cyan-300">📢</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Reporting Mechanisms</h3>
                <p className="text-gray-400">We encourage reporting of ethical concerns via <span className="text-cyan-300">legal@janusforge.ai</span>.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Continuous Improvement */}
        <section className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-8 rounded-2xl border border-gray-700/50">
          <h2 className="text-2xl font-bold mb-4 text-white">Continuous Improvement</h2>
          <p className="text-gray-300 mb-4">
            We recognize that the field of AI ethics is rapidly evolving. We commit to regularly reviewing 
            and updating our practices and this policy to align with leading standards and societal expectations.
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="text-lg">🔄</span>
            <span>This policy is reviewed quarterly and updated as needed.</span>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} Janus Forge Accelerators LLC, a Kentucky Limited Liability Company,
            bda Janus Forge Nexus.
          </p>
          <p className="mt-2">
            For ethics-related inquiries: <a href="mailto:legal@janusforge.ai" className="text-cyan-400 hover:text-cyan-300">legal@janusforge.ai</a>
          </p>
        </div>
      </div>
    </div>
  );
}
