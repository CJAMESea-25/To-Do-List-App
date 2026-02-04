"use client";

import type { Task } from "@/lib/api/tasks.api";
import StatusDropdown from "@/components/ui/StatusDropdown";
import PriorityBadge from "@/components/ui/PriorityBadge";
import TagPill from "@/components/ui/TaskTag";
import { formatShortDate } from "@/lib/hooks/date";
import { Pencil, Trash2 } from "lucide-react";

export default function TaskCard({
  task,
  onPress,
  onChangeStatus,
  onDelete,
  onChangePriority,
  onChangeCategory,
}: {
  task: Task;
  onPress?: (task: Task) => void;

  onChangeStatus: (status: Task["status"]) => void;
  onDelete: () => void;

  onChangePriority?: (priority: Task["priority"]) => void;
  onChangeCategory?: (category: string) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onPress?.(task)}
      className="w-full text-left rounded-2xl border border-slate-200 bg-white px-7 py-6 shadow-sm cursor-pointer"
      >
      <div className="flex items-start justify-between gap-6">
        {/* LEFT */}
        <div className="flex min-w-0 items-start gap-4">
          <StatusDropdown value={task.status} onChange={onChangeStatus} />

          <div className="min-w-0">
            <h3
              className={`truncate text-[17px] font-semibold ${
                task.status === "completed"
                  ? "text-slate-400 line-through"
                  : "text-slate-900"
              }`}
            >
              {task.title}
            </h3>

            {task.description ? (
              <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-slate-500">
                {task.description}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              {task.dueDate ? (
                <span className="text-[13px]">{formatShortDate(task.dueDate)}</span>
              ) : null}

              {task.category ? <TagPill label={task.category} /> : null}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-end gap-3">
          <PriorityBadge
            value={task.priority}
            editable={!!onChangePriority}
            onChange={onChangePriority}
          />

          <div className="flex items-center gap-2">
            {onChangeCategory ? (
              <button
                type="button"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Edit category"
                onClick={(e) => {
                  e.stopPropagation();
                  const next = prompt("Set category:", task.category ?? "");
                  if (next !== null) onChangeCategory(next.trim());
                }}
              >
                <Pencil className="h-4 w-4" />
              </button>
            ) : null}

            <button
              type="button"
              className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-600"
              aria-label="Delete task"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
