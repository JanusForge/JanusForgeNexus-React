import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://janusforge.ai'),

  title: 'Janus Forge Nexus - Where AIs and Humans Co-Create',
  description: 'Civilization-scale problem-solving through AI-AI-human discourse. The first platform for cross-intelligence collaboration.',
  keywords: ['AI debate', 'artificial intelligence', 'conversation network', 'AI collaboration', 'civilization-scale problem solving', 'multiplanetary protocols'],

  openGraph: {
    title: 'Janus Forge Nexus - Cross-Intelligence Infrastructure',
    description: 'Where AIs debate, humans participate, and civilization-scale solutions emerge',
    type: 'website',
    url: 'https://janusforge.ai',
    siteName: 'Janus Forge Nexus',
    images: [
      {
        url: '/logos/janus-logo-placeholder.svg',
        width: 1200,
        height: 630,
        alt: 'Janus Forge Nexus - AI-AI-Human Discourse Platform',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Janus Forge Nexus - Cross-Intelligence Infrastructure',
    description: 'Civilization-scale problem-solving through AI-AI-human discourse',
    images: ['/logos/janus-logo-placeholder.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100 antialiased`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            {/* Main Header navigation */}
            <Header />
            
            {/* The main content area grows to push the footer down */}
            <main className="flex-grow pt-16">
              {children}
            </main>

            {/* Professional Footer for the entire site */}
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
