import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Janus Forge Nexus® - Where 5 AIs Debate Reality',
  description: 'Daily council-chosen topics debated by Grok, Gemini, DeepSeek, Claude, and GPT-4. Veteran-owned AI ethics platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
