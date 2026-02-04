"use client";

import { useMemo } from "react";
import {
  X,
  Calendar,
  Flag,
  FolderKanban,
  Pencil,
  Trash2,
  CheckCircle2,
} from "lucide-react";

import type { Task, TaskStatus, TaskPriority } from "@/lib/api/tasks.api";
import { formatShortDate } from "@/lib/hooks/date";

const priorityStyles: Record<TaskPriority, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200",
};

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

  // backend-connected actions passed from the page
  onStatusChange,
  onDelete,
  onEdit,
}: {
  task: Task;
  onClose: () => void;

  onStatusChange: (id: string, status: TaskStatus) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;

  /**
   * Optional: If you already have an Edit modal/page.
   * If not, you can omit this and just remove the Edit button.
   */
  onEdit?: (task: Task) => void;
}) {
  const dueLabel = useMemo(() => {
    if (!task.dueDate) return "";
    return formatShortDate(task.dueDate);
  }, [task.dueDate]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onMouseDown={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-white/90 p-8 shadow-2xl backdrop-blur-xl"
        onMouseDown={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.08)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-lg p-2 transition-colors hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-slate-500" />
        </button>

        {/* Header */}
        <div className="mb-8 flex items-start gap-4">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value as TaskStatus)}
            onClick={(e) => e.stopPropagation()}
            className={`cursor-pointer rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 ${statusStyles[task.status]}`}
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex-1">
            <h2
              className={`mb-2 text-2xl font-semibold ${
                task.status === "completed"
                  ? "text-slate-400 line-through"
                  : "text-slate-900"
              }`}
            >
              {task.title}
            </h2>

            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}
            >
              <Flag className="mr-1.5 h-3 w-3" />
              {task.priority} priority
            </span>
          </div>
        </div>

        {/* Description */}
        {task.description ? (
          <div className="mb-8">
            <h3 className="mb-3 text-sm text-slate-500">Description</h3>
            <p className="leading-relaxed text-slate-900">{task.description}</p>
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

          {task.dueDate ? (
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-500">Due Date:</span>
              <span className="text-sm text-slate-900">{dueLabel}</span>
            </div>
          ) : null}

          {task.category ? (
            <div className="flex items-center gap-3">
              <FolderKanban className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-500">Category:</span>
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm text-slate-700">
                {task.category}
              </span>
            </div>
          ) : null}
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
            {onEdit ? (
              <button
                onClick={() => {
                  onEdit(task);
                  onClose();
                }}
                className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-800 transition-colors hover:bg-slate-200"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            ) : null}

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
  );
}
