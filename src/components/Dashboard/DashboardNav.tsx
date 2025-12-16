"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Billing', href: '/dashboard/billing' },
  { name: 'Settings', href: '/dashboard/settings' },
  { name: 'Logout', href: '/dashboard/logout' },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold">
              Janus Forge
            </Link>
            <nav className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-blue-900/30 text-blue-300'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
