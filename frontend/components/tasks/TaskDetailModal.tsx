"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  FolderKanban,
  Trash2,
  CheckCircle2,
  Pencil,
} from "lucide-react";

import type { Task, TaskStatus } from "@/lib/api/tasks.api";
import { formatShortDate } from "@/lib/hooks/date";

import PriorityBadge from "@/components/ui/PriorityBadge";
import StatusDropdown from "@/components/ui/StatusDropdown";
import EditTaskModal from "@/components/tasks/EditTaskModal";

const statusStyles: Record<TaskStatus, string> = {
  not_started: "bg-slate-50 text-slate-700 border-slate-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
};

function statusLabel(s: TaskStatus) {
  if (s === "not_started") return "Not Started";
  if (s === "in_progress") return "In Progress";
  return "Completed";
}

export default function TaskDetailModal({
  task,
  onClose,
  onStatusChange,
  onDelete,
  onSaveEdit,
}: {
  task: Task;
  onClose: () => void;
  onStatusChange: (id: string, status: TaskStatus) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onSaveEdit: (
    id: string,
    updates: {
      title: string;
      description?: string;
      priority: Task["priority"];
      status: Task["status"];
      dueDate?: string | null;
      category?: string;
    }
  ) => Promise<void> | void;
}) {
  const [editOpen, setEditOpen] = useState(false);

  const dueLabel = useMemo(() => {
    if (!task.dueDate) return "";
    return formatShortDate(task.dueDate);
  }, [task.dueDate]);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onMouseDown={onClose}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

        <div
          className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-white/90 p-8 shadow-2xl backdrop-blur-xl"
          onMouseDown={(e) => e.stopPropagation()}
          style={{ boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.08)" }}
        >
          {/* ✅ Status at top-right */}
          <div className="absolute right-6 top-6">
            <StatusDropdown
              value={task.status}
              onChange={(v) => onStatusChange(task._id, v)}
            />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2
              className={`mb-2 text-2xl font-semibold ${
                task.status === "completed"
                  ? "text-slate-400 line-through"
                  : "text-slate-900"
              }`}
            >
              {task.title}
            </h2>

            <PriorityBadge value={task.priority} />
          </div>

          {/* Description */}
          {task.description ? (
            <div className="mb-8">
              <h3 className="mb-3 text-sm text-slate-500">Description</h3>
              <p className="leading-relaxed text-slate-900">
                {task.description}
              </p>
            </div>
          ) : null}

          {/* Meta */}
          <div className="space-y-4 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-500">Status:</span>
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[task.status]}`}
              >
                {statusLabel(task.status)}
              </span>
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-500">Due Date:</span>
                <span className="text-sm text-slate-900">{dueLabel}</span>
              </div>
            )}

            {task.category && (
              <div className="flex items-center gap-3">
                <FolderKanban className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-500">Category:</span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm text-slate-700">
                  {task.category}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-between gap-3 border-t border-slate-200 pt-6">
            <button
              onClick={async () => {
                await onDelete(task._id);
                onClose();
              }}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Task
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-800 transition-colors hover:bg-slate-200"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>

              <button
                onClick={onClose}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:opacity-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {editOpen && (
        <EditTaskModal
          task={task}
          onClose={() => setEditOpen(false)}
          onSave={async (id, updates) => {
            await onSaveEdit(id, updates);
            setEditOpen(false);
          }}
        />
      )}
    </>
  );
}
