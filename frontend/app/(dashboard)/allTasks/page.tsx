"use client";

import { useMemo, useState } from "react";
import TaskList from "@/components/tasks/TaskList";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskModal from "@/components/tasks/EditTaskModal";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";
import TaskFilters from "@/components/tasks/TaskFilters";

import { useTasks } from "@/lib/hooks/useTasks";
import type { Task, TaskStatus } from "@/lib/api/tasks.api";

export default function AllTasksPage() {
  const { tasks, loading, err, patch, remove, add } = useTasks();

  const [filter, setFilter] = useState<"all" | TaskStatus>("all");

  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const visibleTasks = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  return (
    <main>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">All Tasks</h1>
          <p className="mt-2 ml-1 text-sm text-slate-500">
            {visibleTasks.length} {visibleTasks.length === 1 ? "task" : "tasks"}
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

      {/* ✅ Clickable cards filter */}
      <div className="mt-6">
        <TaskFilters tasks={tasks} value={filter} onChange={setFilter} />
      </div>

      {loading && <p className="mt-8 text-slate-500">Loading...</p>}
      {err && <p className="mt-8 text-red-600">{err}</p>}

      {!loading && !err && (
        <>
          {visibleTasks.length === 0 ? (
            <p className="mt-8 text-slate-500">
              {filter === "all" ? "No tasks found..." : "No tasks in this filter..."}
            </p>
          ) : (
            <TaskList
              tasks={visibleTasks}
              onPressTask={(task) => setSelected(task)}
              onEditTask={(task) => {
                setSelected(null);
                setEditTask(task);
              }}
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

            // keep details modal synced if it happens to be open for same task
            setSelected((curr) => (curr?._id === id ? updated : curr));

            setEditTask(null);
          }}
        />
      )}
    </main>
  );
}
