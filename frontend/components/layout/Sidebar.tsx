"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, CalendarRange, FolderKanban, CalendarDays } from "lucide-react";
import { useMemo } from "react";

import { useTasks } from "@/lib/hooks/useTasks";

function toYMD(dateStr?: string | null) {
  if (!dateStr) return null;
  if (dateStr.length >= 10) return dateStr.slice(0, 10);
  return null;
}

function todayYMD() {
  return new Date().toISOString().slice(0, 10);
}

type NavItem = {
  href: string;
  id: "allTasks" | "today" | "upcoming" | "calendar";
  label: string;
  icon: React.ReactNode;
  showCount?: boolean;
};

export default function Sidebar() {
  const pathname = usePathname();
  const { tasks } = useTasks();

  const counts = useMemo(() => {
    const today = todayYMD();

    let todayCount = 0;
    let upcomingCount = 0;

    for (const t of tasks) {
      const ymd = toYMD(t.dueDate);
      if (!ymd) continue;

      if (ymd === today) todayCount += 1;
      else if (ymd > today) upcomingCount += 1;
    }

    return { todayCount, upcomingCount };
  }, [tasks]);

  const navItems: NavItem[] = [
    {
      id: "allTasks",
      href: "/allTasks",
      label: "All Tasks",
      icon: <FolderKanban className="h-5 w-5" />,
    },
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
  ];

  const getCount = (id: NavItem["id"]) => {
    if (id === "today") return counts.todayCount;
    if (id === "upcoming") return counts.upcomingCount;
    return undefined;
  };

  return (
    <aside className="h-[calc(100vh-5rem)] w-64 border-r border-slate-200 bg-white px-4 py-8">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const count = item.showCount ? getCount(item.id) : undefined;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={[
                "flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors",
                active
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")}
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
