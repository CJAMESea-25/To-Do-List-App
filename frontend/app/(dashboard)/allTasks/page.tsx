"use client";

import { useState } from "react";
import TaskStats from "@/components/tasks/TaskStats";
import TaskList from "@/components/tasks/TaskList";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";
import { useTasks } from "@/lib/hooks/useTasks";
import type { Task } from "@/lib/api/tasks.api";

export default function AllTasksPage() {
  const { tasks, loading, err, patch, remove, add, refresh } = useTasks();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">All Tasks</h1>
          <p className="mt-2 text-sm text-slate-500">{tasks.length} tasks</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-sm hover:opacity-95"
        >
          + Add Task
        </button>
      </div>

      <div className="mt-6">
        <TaskStats tasks={tasks} />
      </div>

      {loading && <p className="mt-8 text-slate-500">Loading...</p>}
      {err && <p className="mt-8 text-red-600">{err}</p>}

      {!loading && !err && (
        <>
          {tasks.length === 0 ? (
            <p className="mt-8 text-slate-500">No tasks found.</p>
          ) : (
            <TaskList
              tasks={tasks}
              onPressTask={(task) => setSelected(task)} 
              onChangeStatus={async (id, status) => {
                await patch(id, { status });
              }}
              onDelete={async (id) => {
                await remove(id);
                if (selected?._id === id) setSelected(null);
              }}
            />
          )}
        </>
      )}

      {open && (
        <AddTaskModal
          onClose={() => setOpen(false)}
          onAdd={async (payload) => {
            const created = await add(payload);
            console.log("created task:", created);

            await refresh(); // optional, keep if you want backend truth
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
            setSelected(updated); // keep modal in sync
          }}
          onDelete={async (id) => {
            await remove(id);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
