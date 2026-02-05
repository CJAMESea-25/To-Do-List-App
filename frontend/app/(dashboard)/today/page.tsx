"use client";

import { useMemo, useState } from "react";
import TaskList from "@/components/tasks/TaskList";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";
import EditTaskModal from "@/components/tasks/EditTaskModal";
import { useTasks } from "@/lib/hooks/useTasks";
import { isToday } from "@/lib/hooks/date";
import type { Task } from "@/lib/api/tasks.api";

export default function TodayPage() {
  const { tasks, loading, err, patch, remove, add } = useTasks();

  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const todayTasks = useMemo(() => {
    return tasks.filter((t) => isToday(t.dueDate));
  }, [tasks]);

  return (
    <main>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">Today</h1>
          <p className="mt-2 ml-1 text-sm text-slate-500">
            {todayTasks.length} tasks
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-sm hover:opacity-95"
        >
          + Add Task
        </button>
      </div>

      {loading && <p className="mt-8 text-slate-500">Loading...</p>}
      {err && <p className="mt-8 text-red-600">{err}</p>}

      {!loading && !err && (
        <>
          {todayTasks.length === 0 ? (
            <p className="mt-8 text-slate-500">No tasks due today...</p>
          ) : (
            <TaskList
              tasks={todayTasks}
              onEditTask={(task) => setEditTask(task)}
              onChangeStatus={async (id, status) => {
                const updated = await patch(id, { status });
                setSelected((curr) => (curr?._id === id ? updated : curr));
              }}
              onDelete={async (id) => {
                await remove(id);
                setSelected((curr) => (curr?._id === id ? null : curr));
              }}
              onPressTask={(task) => setSelected(task)}
            />
          )}
        </>
      )}

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
