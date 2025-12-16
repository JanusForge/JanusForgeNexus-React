import DashboardNav from '@/components/Dashboard/DashboardNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardNav />
      <div className="lg:pl-64">
        <main className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
