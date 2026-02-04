import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar />
      <div className="mx-auto flex max-w-350">
        <Sidebar />
        <div className="flex-1 px-10 py-10">{children}</div>
      </div>
    </div>
  );
}
