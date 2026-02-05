"use client";

import type { TaskPriority } from "@/lib/api/tasks.api";

export default function PriorityBadge({
  value,
  onChange,
  editable = false,
  className = "",
}: {
  value: TaskPriority;
  onChange?: (p: TaskPriority) => void;
  editable?: boolean;
  className?: string;
}) {
  const styles =
    value === "high"
      ? "border-red-200 bg-red-50 text-red-600"
      : value === "low"
      ? "border-blue-200 bg-blue-50 text-blue-600"
      : "border-yellow-200 bg-yellow-50 text-yellow-700";

  if (!editable || !onChange) {
    return (
      <span
        className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles} ${className}`}
      >
        {value.toLowerCase()} priority
      </span>
    );
  }

  return (
  <select
      value={value}
      onChange={(e) => onChange(e.target.value as TaskPriority)}
      onClick={(e) => e.stopPropagation()}
      className={`rounded-full border px-3 py-1 text-xs font-semibold outline-none appearance-none ${styles} ${className}`}
    >
      <option value="low">low</option>
      <option value="medium">medium</option>
      <option value="high">high</option>
    </select>
  );
}
