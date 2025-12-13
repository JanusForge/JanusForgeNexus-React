import type { Metadata } from 'next';
import DashboardNav from '@/components/Dashboard/DashboardNav';

export const metadata: Metadata = {
  title: 'Dashboard - Janus Forge Nexus',
  description: 'Manage your subscription and account',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DashboardNav />
      {children}
    </>
  );
}
