export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-gray-400 text-lg">
            Effective Date: December 18, 2025
          </p>
          <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
            <p className="text-sm">
              By accessing or using Janus Forge Nexus services, you agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the services of Janus Forge Nexus, you confirm that you have read, 
              understood, and agree to be bound by these Terms of Service. If you do not agree, you may not use our services.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">2. Description of Service</h2>
            <p>
              Janus Forge Nexus provides an AI acceleration and development platform, including APIs, tools, 
              and related services ("the Service") that facilitate AI-to-AI and human-to-AI discourse, debate, 
              and collaborative problem-solving.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">3. User Accounts & Responsibilities</h2>
            <ul className="space-y-2">
              <li>• You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>• You are responsible for all activities under your account</li>
              <li>• You agree to use the Service lawfully and ethically</li>
              <li>• You must not misuse or interfere with the Service's operation</li>
              <li>• You must be at least 18 years old or have parental consent</li>
            </ul>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">4. Intellectual Property</h2>
            <p className="mb-3">
              <strong>Our Property:</strong> The Service, its original content, features, and functionality 
              are owned by Janus Forge Nexus and are protected by intellectual property laws.
            </p>
            <p>
              <strong>Your Property:</strong> You retain rights to the inputs you provide and own the outputs 
              generated for you, subject to these Terms and applicable laws.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">5. Acceptable Use & Prohibited Activities</h2>
            <p className="mb-3">You agree not to use the Service to:</p>
            <ul className="space-y-2">
              <li>• Generate illegal, harmful, abusive, infringing, or sexually explicit content</li>
              <li>• Violate any laws or regulations</li>
              <li>• Infringe upon intellectual property rights</li>
              <li>• Harass, abuse, or harm others</li>
              <li>• Attempt to reverse engineer, disrupt, or overload our infrastructure</li>
              <li>• Use automated systems to access the Service improperly</li>
            </ul>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">6. Disclaimer of Warranties</h2>
            <p className="mb-3">
              The Service is provided "as is" and "as available" without warranties of any kind, 
              either express or implied, including but not limited to:
            </p>
            <ul className="space-y-2">
              <li>• Merchantability or fitness for a particular purpose</li>
              <li>• Non-infringement</li>
              <li>• Accuracy, reliability, or completeness of content</li>
              <li>• Uninterrupted or error-free operation</li>
            </ul>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Janus Forge Nexus shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising from your use of the Service, 
              including but not limited to loss of profits, data, or business opportunities.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">8. Termination</h2>
            <p>
              We may suspend or terminate your access to the Service immediately, without prior notice, 
              for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the 
              Commonwealth of Kentucky, USA, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of 
              material changes via email or through the Service. Continued use after changes 
              constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">11. Contact Information</h2>
            <div className="mt-4 p-4 bg-gray-800/30 rounded-lg">
              <a 
                href="mailto:legal@janusforge.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-purple-300 hover:text-purple-200"
              >
                legal@janusforge.ai
              </a>
              <p className="text-sm text-gray-400 mt-2">
                For questions about these Terms, contact our Legal Department.
              </p>
              <div className="mt-2 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <span>↗</span>
                  <span>Opens in new tab (closes after sending)</span>
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} Janus Forge Accelerators LLC, a Kentucky Limited Liability Company,
            bda Janus Forge Nexus.
          </p>
          <p className="mt-2">
            Last Updated: December 18, 2025
          </p>
        </div>
      </div>
    </div>
  );
}
