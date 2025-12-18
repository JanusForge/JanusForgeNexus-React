export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg">
            Effective Date: December 18, 2025
          </p>
          <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
            <p className="text-sm">
              This Privacy Policy explains how Janus Forge Nexus collects, uses, discloses, and safeguards 
              your information when you use our AI platform and services.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">1. Information We Collect</h2>
            <ul className="space-y-3 list-disc pl-5">
              <li><strong>Personal Information:</strong> Name, email address, company details, and contact information you provide.</li>
              <li><strong>Usage Data:</strong> IP address, browser type, pages visited, and interaction metrics.</li>
              <li><strong>AI & Technical Data:</strong> Inputs, prompts, and outputs generated through our platform (anonymized where feasible).</li>
            </ul>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">2. How We Use Your Information</h2>
            <ul className="space-y-2">
              <li>• To provide, operate, and maintain our AI services</li>
              <li>• To improve and personalize user experience</li>
              <li>• To communicate with you (support, updates, marketing)</li>
              <li>• To ensure security and prevent fraud</li>
              <li>• To comply with legal obligations</li>
            </ul>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">3. Data Sharing & Disclosure</h2>
            <p className="mb-3">
              <strong>We do not sell your personal information.</strong> We may share data with:
            </p>
            <ul className="space-y-2">
              <li>• Trusted service providers under strict confidentiality agreements</li>
              <li>• Legal authorities when required by law</li>
              <li>• To protect our rights, safety, or property</li>
            </ul>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">4. Data Security</h2>
            <p>
              We implement robust technical and organizational measures to protect your data, including 
              encryption, access controls, and regular security assessments. However, no electronic 
              transmission or storage method is 100% secure.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">5. Your Rights</h2>
            <p className="mb-3">
              Depending on your jurisdiction, you may have rights to:
            </p>
            <ul className="space-y-2">
              <li>• Access your personal data</li>
              <li>• Correct inaccurate information</li>
              <li>• Delete your personal data</li>
              <li>• Restrict or object to processing</li>
              <li>• Data portability</li>
            </ul>
            <p className="mt-4 text-sm text-gray-400">
              To exercise these rights, contact us at:{" "}
              <a href="mailto:legal@janusforge.ai" className="text-blue-400 hover:text-blue-300">
                legal@janusforge.ai
              </a>
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">6. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. The updated effective date will be posted 
              at the top of this page. We encourage you to review this policy regularly.
            </p>
          </section>

          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-800/50">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">7. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact our Legal Department:
            </p>
            <div className="mt-4 p-4 bg-gray-800/30 rounded-lg">
              <p className="font-mono text-blue-300">legal@janusforge.ai</p>
              <p className="text-sm text-gray-400 mt-2">
                Janus Forge Accelerators LLC<br />
                A Kentucky Limited Liability Company<br />
                Doing Business As: Janus Forge Nexus
              </p>
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
