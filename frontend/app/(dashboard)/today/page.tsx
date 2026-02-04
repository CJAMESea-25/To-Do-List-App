"use client";

import { useMemo, useState } from "react";
import TaskList from "@/components/tasks/TaskList"; 
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";
import { useTasks } from "@/lib/hooks/useTasks";
import { isToday } from "@/lib/hooks/date";
import type { Task } from "@/lib/api/tasks.api";

export default function TodayPage() {
  const { tasks, loading, err, patch, remove, add, refresh } = useTasks();

  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);

  const todayTasks = useMemo(() => {
    return tasks.filter((t) => isToday(t.dueDate));
  }, [tasks]);

  return (
    <main>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">Today</h1>
          <p className="mt-2 text-sm text-slate-500">{todayTasks.length} tasks</p>
        </div>

        <button
          onClick={() => setAddOpen(true)}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-sm hover:opacity-50"
        >
          + Add Task
        </button>
      </div>

      {loading && <p className="mt-8 text-slate-500">Loading...</p>}
      {err && <p className="mt-8 text-red-600">{err}</p>}

      {!loading && !err && (
        <>
          {todayTasks.length === 0 ? (
            <p className="mt-8 text-slate-500">No tasks due today.</p>
          ) : (
            <TaskList
              tasks={todayTasks}
              onChangeStatus={async (id, status) => {
                await patch(id, { status });
              }}
              onDelete={async (id) => {
                await remove(id);
              }}
              // ✅ Make each task pressable (TaskList must support this prop)
              onPressTask={(task) => setSelected(task)}
            />
          )}
        </>
      )}

      {addOpen && (
        <AddTaskModal
          onClose={() => setAddOpen(false)}
          onAdd={async (payload) => {
            const created = await add(payload);

            console.log("created task:", created);
            await refresh();

            setAddOpen(false);
          }}
        />
      )}

      {/* ✅ Task preview modal (optional, but this makes "pressable task" work) */}
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
