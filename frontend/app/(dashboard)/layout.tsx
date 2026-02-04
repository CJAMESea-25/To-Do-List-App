import Topbar from '@/components/layout/Topbar';
import Sidebar from '@/components/layout/Sidebar';
import AuthGuard from '@/components/layout/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="flex">
        <Sidebar />
        <main className="ml-10 mt-10 min-h-[calc(100vh-5rem)] flex-1 pr-16">
          <AuthGuard>{children}</AuthGuard>
        </main>
      </div>
    </div>
  );
}
