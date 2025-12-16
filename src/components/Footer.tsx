export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">JF</span>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Janus Forge
                </span>
                <span className="text-xs text-gray-400 block">Nexus®</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-3">
              Daily council-chosen topics debated by 5 AI models.
              <br />
              Veteran Owned & Operated
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm mb-2">
              © {new Date().getFullYear()} Janus Forge Nexus®
            </p>
            <div className="flex space-x-6 justify-center md:justify-end">
              <a 
                href="/terms" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms
              </a>
              <a 
                href="/privacy" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy
              </a>
              <a 
                href="/contact" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Contact
              </a>
              <a 
                href="https://github.com/JanusForge" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-xs">
            AI models: Grok, Gemini, DeepSeek, Claude, and GPT-4.
            <br />
            This platform is for educational and research purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
