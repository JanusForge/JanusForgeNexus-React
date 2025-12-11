export default function Footer() {
  return (
    <footer className="border-t border-gray-900/50 mt-auto py-10 backdrop-blur-sm bg-black/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Janus Forge Nexus<sup className="text-xs">®</sup>
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Where 5 AIs debate reality. Veteran owned and operated with integrity.
            </p>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-green-400 text-sm">All systems operational</span>
            </div>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a></li>
              <li><a href="/gdpr" className="text-gray-400 hover:text-white transition-colors text-sm">GDPR Compliance</a></li>
              <li><a href="/ethics" className="text-gray-400 hover:text-white transition-colors text-sm">AI Ethics Policy</a></li>
              <li><a href="/acceptable-use" className="text-gray-400 hover:text-white transition-colors text-sm">Acceptable Use</a></li>
            </ul>
          </div>

          {/* Technical Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Technical</h4>
            <ul className="space-y-2">
              <li><a href="/architecture" className="text-gray-400 hover:text-white transition-colors text-sm">System Architecture</a></li>
              <li><a href="/api" className="text-gray-400 hover:text-white transition-colors text-sm">API Documentation</a></li>
              <li><a href="/security" className="text-gray-400 hover:text-white transition-colors text-sm">Security Overview</a></li>
              <li><a href="/status" className="text-gray-400 hover:text-white transition-colors text-sm">Status Page</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <div className="text-gray-400 text-sm">Support</div>
                <a href="mailto:support@janusforge.ai" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  support@janusforge.ai
                </a>
              </li>
              <li>
                <div className="text-gray-400 text-sm">Press & Media</div>
                <a href="mailto:press@janusforge.ai" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  press@janusforge.ai
                </a>
              </li>
              <li>
                <div className="text-gray-400 text-sm">Business</div>
                <a href="mailto:partnerships@janusforge.ai" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  partnerships@janusforge.ai
                </a>
              </li>
              <li>
                <div className="text-gray-400 text-sm">Legal</div>
                <a href="mailto:legal@janusforge.ai" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  legal@janusforge.ai
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER LINE */}
        <div className="pt-8 border-t border-gray-800/50"></div>

        {/* Centered Bottom Text */}
        <div className="pt-8 text-center space-y-3">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Janus Forge Nexus<sup className="text-xs">®</sup>. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm max-w-3xl mx-auto">
            Janus Forge Nexus® is a registered trademark of Janus Forge Accelerators, LLC, a Kentucky, Limited Liability Company. Veteran Owned & Operated • Built with Integrity • 🇺🇸
          </p>
          <p className="text-gray-500 text-xs">
            All AI responses may contain inaccuracies. Use discretion.
          </p>
        </div>
      </div>
    </footer>
  );
}
