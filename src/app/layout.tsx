import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JanusForge - AI-Powered Debate Platform',
  description: 'Create, participate, and analyze debates with multiple AI models. Experience dual-perspective AI debates.',
  keywords: ['AI debate', 'artificial intelligence', 'debate platform', 'critical thinking', 'token system'],
  openGraph: {
    title: 'JanusForge - AI-Powered Debate Platform',
    description: 'Where perspectives collide and wisdom emerges',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to video hosting if needed */}
        <link rel="preconnect" href="https://assets.janusforge.ai" />
        
        {/* Video metadata */}
        <meta property="og:video" content="https://janusforge.ai/janus-logo-animation.mp4" />
        <meta property="og:video:type" content="video/mp4" />
        <meta property="og:video:width" content="256" />
        <meta property="og:video:height" content="256" />
      </head>
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
