"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, CalendarRange, FolderKanban, CalendarDays } from "lucide-react";
import { useMemo } from "react";

import { useTasks } from "@/lib/hooks/useTasks";

/** Convert a dueDate value (ISO or YYYY-MM-DD) into YYYY-MM-DD (local-safe). */
function toYMD(dateStr?: string | null) {
  if (!dateStr) return null;

  // If already YYYY-MM-DD, keep it
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  // Otherwise parse ISO and convert to local YMD
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function todayYMD() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

type NavItem = {
  href: string;
  id: string;
  label: string;
  icon: React.ReactNode;
  showCount?: boolean;
};

export default function Sidebar() {
  const pathname = usePathname();
  const { tasks } = useTasks();

  const counts = useMemo(() => {
    const today = todayYMD();

    const todayCount = tasks.filter((t) => toYMD(t.dueDate) === today).length;

    const upcomingCount = tasks.filter((t) => {
      const ymd = toYMD(t.dueDate);
      if (!ymd) return false;
      return ymd > today; // string compare works for YYYY-MM-DD
    }).length;

    return { todayCount, upcomingCount };
  }, [tasks]);

  const navItems: NavItem[] = [
    {
      id: "today",
      href: "/today",
      label: "Today",
      icon: <Calendar className="h-5 w-5" />,
      showCount: true,
    },
    {
      id: "upcoming",
      href: "/upcoming",
      label: "Upcoming",
      icon: <CalendarRange className="h-5 w-5" />,
      showCount: true,
    },
    {
      id: "calendar",
      href: "/calendar",
      label: "Calendar",
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      id: "allTasks",
      href: "/allTasks",
      label: "All Tasks",
      icon: <FolderKanban className="h-5 w-5" />,
    },
  ];

  const getCount = (id: string) => {
    if (id === "today") return counts.todayCount;
    if (id === "upcoming") return counts.upcomingCount;
    return undefined;
  };

  return (
    <aside className="w-64 border-r border-slate-200 bg-white h-[calc(100vh-5rem)] flex flex-col py-8 px-4">
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const count = item.showCount ? getCount(item.id) : undefined;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                active
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </div>

              {count !== undefined && (
                <span className="text-xs text-slate-400">{count}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
