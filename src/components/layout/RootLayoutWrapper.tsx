'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar'; // ✅ Fixed: Points to Navbar instead of Header
import Footer from '@/components/layout/Footer';

export default function RootLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  // Keep these paths clean of the Nav/Footer
  const hideHeaderFooter = ['/login', '/register', '/test-integration'].includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Fixed: Uses Navbar component */}
      {!hideHeaderFooter && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}
