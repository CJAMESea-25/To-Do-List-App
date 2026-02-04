"use client";

import { useMemo, useState } from "react";
import TaskList from "@/components/tasks/TaskList";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";
import { useTasks } from "@/lib/hooks/useTasks";
import type { Task } from "@/lib/api/tasks.api";

/** Normalize dueDate (ISO or YYYY-MM-DD) to YYYY-MM-DD */
function toYMD(dateStr?: string | null) {
  if (!dateStr) return null;

  // already date-only
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

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

export default function UpcomingPage() {
  const { tasks, loading, err, patch, remove, add } = useTasks();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null); // ✅ NEW

  const upcomingTasks = useMemo(() => {
    const today = todayYMD();

    const upcoming = tasks.filter((t) => {
      const ymd = toYMD(t.dueDate);
      if (!ymd) return false;
      return ymd > today; // strictly after today
    });

    // sort soonest first
    upcoming.sort((a, b) => {
      const ay = toYMD(a.dueDate) ?? "9999-12-31";
      const by = toYMD(b.dueDate) ?? "9999-12-31";
      return ay.localeCompare(by);
    });

    return upcoming;
  }, [tasks]);

  return (
    <main className="px-0">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">Upcoming</h1>
          <p className="mt-2 text-sm text-slate-500">
            {upcomingTasks.length} {upcomingTasks.length === 1 ? "task" : "tasks"}
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-2xl bg-slate-900 px-6 py-3 text-white shadow-sm hover:opacity-95"
        >
          + Add Task
        </button>
      </div>

      {/* Body */}
      <div className="mt-8">
        {loading && <p className="text-slate-500">Loading...</p>}
        {err && <p className="text-red-600">{err}</p>}

        {!loading && !err && (
          <>
            {upcomingTasks.length === 0 ? (
              <p className="text-slate-500">No upcoming tasks.</p>
            ) : (
              <TaskList
                tasks={upcomingTasks}
                onPressTask={(task) => setSelected(task)} // ✅ CLICKABLE
                onChangeStatus={async (id, status) => {
                  const updated = await patch(id, { status });
                  if (selected?._id === id) setSelected(updated);
                }}
                onDelete={async (id) => {
                  await remove(id);
                  if (selected?._id === id) setSelected(null);
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Add Task Modal */}
      {open && (
        <AddTaskModal
          onClose={() => setOpen(false)}
          onAdd={async (payload) => {
            await add(payload);
            setOpen(false);
          }}
        />
      )}

      {/* ✅ Task preview modal */}
      {selected && (
        <TaskDetailModal
          task={selected}
          onClose={() => setSelected(null)}
          onStatusChange={async (id, status) => {
            const updated = await patch(id, { status });
            setSelected(updated);
          }}
          onDelete={async (id) => {
            await remove(id);
            setSelected(null);
          }}
        />
      )}
    </main>
  );
}
