"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { TaskPriority, TaskStatus } from "@/lib/api/tasks.api";

export type TaskFilterState = {
  q: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  category: string; // "all" or category name
};

export default function TaskFilters({
  value,
  onChange,
  categories,
}: {
  value: TaskFilterState;
  onChange: (v: TaskFilterState) => void;
  categories: string[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filter
      </button>

      {open && (
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
          <input
            value={value.q}
            onChange={(e) => onChange({ ...value, q: e.target.value })}
            placeholder="Search tasks..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          />

          <select
            value={value.status}
            onChange={(e) =>
              onChange({ ...value, status: e.target.value as TaskFilterState["status"] })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="all">All status</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={value.priority}
            onChange={(e) =>
              onChange({
                ...value,
                priority: e.target.value as TaskFilterState["priority"],
              })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="all">All priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={value.category}
            onChange={(e) => onChange({ ...value, category: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All categories" : c}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
