"use client";

import { ChevronDown } from "lucide-react";
import type { TaskStatus } from "@/lib/api/tasks.api";

export default function StatusDropdown({
  value,
  onChange,
  className = "",
}: {
  value: TaskStatus;
  onChange: (v: TaskStatus) => void;
  className?: string;
}) {
  const base =
    "relative inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-300";

  const cls =
    value === "completed"
      ? `border-green-200 bg-green-50 text-green-900`
      : value === "in_progress"
      ? `border-blue-200 bg-blue-50 text-blue-900`
      : `border-slate-200 bg-white text-slate-900`;

  return (
    <div className={`relative ${className}`}>
      <select
        className={`${base} ${cls} appearance-none pr-10`}
        value={value}
        onChange={(e) => onChange(e.target.value as TaskStatus)}
        onClick={(e) => e.stopPropagation()} 
      >
        <option value="not_started">Not Started</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-100" />
    </div>
  );
}
