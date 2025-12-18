export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 mb-8">
            Have questions? Reach out to our team.
          </p>
          
          <div className="bg-gray-800/30 rounded-xl p-8 text-left">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-gray-300">support@janusforge.ai</p>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">GitHub</h3>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                github.com/janusforge
              </a>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Business Hours</h3>
              <p className="text-gray-300">Monday - Friday: 9AM - 5PM EST</p>
            </div>
          </div>
          
          <a href="/" className="mt-8 inline-block text-blue-400 hover:text-blue-300">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}
