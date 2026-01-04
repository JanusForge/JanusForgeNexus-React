import Link from 'next/link';

export default function ArchivePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-8 opacity-80">
          <span className="text-6xl">📚</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Topic Archive
        </h1>
        <p className="text-2xl text-gray-400 mb-12">
          Historical AI Council debates — coming soon.
        </p>
        <p className="text-gray-500 mb-16 leading-relaxed">
          We're carefully curating and organizing the full archive of past debates, complete with search, transcripts, and downloadable resources.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl font-bold text-lg transition-all"
        >
          ← Return to Live Nexus
        </Link>
      </div>
    </div>
  );
}
