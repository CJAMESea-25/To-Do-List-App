"use client";

import { useMemo, useState } from "react";
import TaskList from "@/components/tasks/TaskList";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";
import EditTaskModal from "@/components/tasks/EditTaskModal";
import { useTasks } from "@/lib/hooks/useTasks";
import type { Task } from "@/lib/api/tasks.api";

function toYMDUTC(dateStr?: string | null) {
  if (!dateStr) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;

  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function todayYMDUTC() {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function UpcomingPage() {
  const { tasks, loading, err, patch, remove, add } = useTasks();

  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const upcomingTasks = useMemo(() => {
    const today = todayYMDUTC();

    const upcoming = tasks.filter((t) => {
      const ymd = toYMDUTC(t.dueDate);
      if (!ymd) return false;
      return ymd > today;
    });

    upcoming.sort((a, b) => {
      const ay = toYMDUTC(a.dueDate) ?? "9999-12-31";
      const by = toYMDUTC(b.dueDate) ?? "9999-12-31";
      return ay.localeCompare(by);
    });

    return upcoming;
  }, [tasks]);

  return (
    <main>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">Upcoming</h1>
          <p className="mt-2 ml-1 text-sm text-slate-500">
            {upcomingTasks.length} {upcomingTasks.length === 1 ? "task" : "tasks"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="rounded-2xl bg-slate-900 px-6 py-3 text-white shadow-sm hover:opacity-95"
        >
          + Add Task
        </button>
      </div>

      <div className="mt-8">
        {loading && <p className="text-slate-500">Loading...</p>}
        {err && <p className="text-red-600">{err}</p>}

        {!loading && !err && (
          <>
            {upcomingTasks.length === 0 ? (
              <p className="text-slate-500">No upcoming tasks....</p>
            ) : (
              <TaskList
                tasks={upcomingTasks}
                onPressTask={(task) => setSelected(task)}
                onEditTask={(task) => setEditTask(task)}
                onChangeStatus={async (id, status) => {
                  const updated = await patch(id, { status });
                  setSelected((curr) => (curr?._id === id ? updated : curr));
                }}
                onDelete={async (id) => {
                  await remove(id);
                  setSelected((curr) => (curr?._id === id ? null : curr));
                }}
              />
            )}
          </>
        )}
      </div>

      {addOpen && (
        <AddTaskModal
          onClose={() => setAddOpen(false)}
          onAdd={async (payload) => {
            await add(payload);
            setAddOpen(false);
          }}
        />
      )}
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
          onSaveEdit={async (id, updates) => {
            const updated = await patch(id, updates);
            setSelected(updated);
          }}
        />
      )}
      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onSave={async (id, updates) => {
            const updated = await patch(id, updates);

            setSelected((curr) => (curr?._id === id ? updated : curr));

            setEditTask(null);
          }}
        />
      )}
    </main>
  );
}
