import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://janusforge.ai'),
  title: 'Janus Forge Nexus® - Where 5 AIs Debate Reality',
  description: 'Daily council-chosen topics debated by Grok, Gemini, DeepSeek, Claude, and GPT-4. Veteran-owned AI ethics platform.',
  keywords: ['AI debate', 'multi-agent', 'AI council', 'daily topics', 'ethical AI'],
  authors: [{ name: 'Janus Forge Nexus' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://janusforgenexus.com',
    title: 'Janus Forge Nexus® - Where 5 AIs Debate Reality',
    description: 'Daily council-chosen topics debated by 5 AI models.',
    siteName: 'Janus Forge Nexus',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Janus Forge Nexus®',
    description: 'Where 5 AIs Debate Reality',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
