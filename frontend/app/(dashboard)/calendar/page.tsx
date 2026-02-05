"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useTasks } from "@/lib/hooks/useTasks";
import type { Task } from "@/lib/api/tasks.api";
import TaskList from "@/components/tasks/TaskList";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";
import EditTaskModal from "@/components/tasks/EditTaskModal";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toYMDLocal(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function toYMDFromStr(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  if (dateStr.length >= 10) return dateStr.slice(0, 10);
  return null;
}

function todayYMD() {
  return new Date().toISOString().slice(0, 10);
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function startOfCalendarGrid(monthStart: Date) {
  const s = new Date(monthStart);
  const day = s.getDay(); 
  s.setDate(s.getDate() - day);
  return s;
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function monthLabel(d: Date) {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function CalendarPage() {
  const { tasks, loading, err, patch, remove, add } = useTasks();
  const [monthCursor, setMonthCursor] = useState<Date>(() => startOfMonth(new Date()));
  const [selectedYMD, setSelectedYMD] = useState<string>(() => todayYMD());
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();

    for (const t of tasks) {
      const ymd = toYMDFromStr(t.dueDate);
      if (!ymd) continue;

      const prev = map.get(ymd) ?? [];
      prev.push(t);
      map.set(ymd, prev);
    }

    return map;
  }, [tasks]);

  const gridDays = useMemo(() => {
    const start = startOfCalendarGrid(startOfMonth(monthCursor));
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [monthCursor]);

  const monthStart = startOfMonth(monthCursor);
  const monthEnd = endOfMonth(monthCursor);

  const selectedTasks = useMemo(() => {
    return tasksByDay.get(selectedYMD) ?? [];
  }, [tasksByDay, selectedYMD]);

  const today = todayYMD();

  return (
    <main>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">Calendar</h1>
          <p className="mt-2 text-sm text-slate-500">View tasks by due date</p>
        </div>

        <button
          type="button"
          onClick={() => setOpenAdd(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-white shadow-sm hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* Calendar card */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">
            {monthLabel(monthCursor)}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
              onClick={() =>
                setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))
              }
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
              onClick={() =>
                setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))
              }
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="ml-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
              onClick={() => {
                const now = new Date();
                setMonthCursor(startOfMonth(now));
                setSelectedYMD(todayYMD());
              }}
            >
              Today
            </button>
          </div>
        </div>

        {/* Weekdays */}
        <div className="mt-5 grid grid-cols-7 gap-2 text-xs font-medium text-slate-500">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((w) => (
            <div key={w} className="px-2 py-1">{w}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-2 grid grid-cols-7 gap-2">
          {gridDays.map((d) => {
            const ymd = toYMDLocal(d);
            const inMonth = d >= monthStart && d <= monthEnd;
            const isToday = ymd === today;
            const isSelected = ymd === selectedYMD;

            const dayTasks = tasksByDay.get(ymd) ?? [];
            const count = dayTasks.length;

            return (
              <button
                key={ymd}
                type="button"
                onClick={() => setSelectedYMD(ymd)}
                className={[
                  "relative h-20 rounded-xl border p-2 text-left transition",
                  inMonth ? "bg-white" : "bg-slate-50",
                  isSelected
                    ? "border-slate-900 ring-2 ring-slate-200"
                    : "border-slate-200 hover:bg-slate-50",
                ].join(" ")}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={[
                      "text-sm font-medium",
                      inMonth ? "text-slate-900" : "text-slate-400",
                      isToday ? "text-blue-700" : "",
                    ].join(" ")}
                  >
                    {d.getDate()}
                  </div>

                  {count > 0 ? (
                    <div className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] text-white">
                      {count}
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day tasks */}
      <div className="mt-8">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Tasks for {selectedYMD}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{selectedTasks.length} tasks</p>
        </div>

        {loading && <p className="text-slate-500">Loading...</p>}
        {err && <p className="text-red-600">{err}</p>}

        {!loading && !err && (
          selectedTasks.length === 0 ? (
            <p className="text-slate-500">No tasks for this date.</p>
          ) : (
            <TaskList
              tasks={selectedTasks}
              onPressTask={(task) => setSelectedTask(task)}
              onEditTask={(task) => setEditTask(task)}
              onChangeStatus={async (id, status) => {
                const updated = await patch(id, { status });
                setSelectedTask((curr) => (curr?._id === id ? updated : curr));
              }}
              onDelete={async (id) => {
                await remove(id);
                setSelectedTask((curr) => (curr?._id === id ? null : curr));
              }}
            />
          )
        )}
      </div>

      {openAdd && (
        <AddTaskModal
          onClose={() => setOpenAdd(false)}
          onAdd={async (payload) => {
            const created = await add(payload);

            // ✅ jump to the date of the task you created
            const ymd = toYMDFromStr(created.dueDate) ?? todayYMD();
            setSelectedYMD(ymd);
            setMonthCursor(startOfMonth(new Date(ymd)));

            setOpenAdd(false);
          }}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
           onStatusChange={async (id, status) => {
            const updated = await patch(id, { status });
            setSelectedTask(updated);
          }}
           onDelete={async (id) => {
             await remove(id);
            setSelectedTask(null);
          }}
          onSaveEdit={async (id, updates) => {
             const updated = await patch(id, updates);
             setSelectedTask(updated);
           }}
         />
       )}
      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onSave={async (id, updates) => {
            const updated = await patch(id, updates);

            // keep any open detail modal synced
            setSelectedTask((curr) => (curr?._id === id ? updated : curr));

            setEditTask(null);
          }}
        />
      )}
    </main>
  );
}
