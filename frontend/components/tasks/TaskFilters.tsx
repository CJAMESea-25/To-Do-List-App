"use client";

import type { Task, TaskStatus } from "@/lib/api/tasks.api";

type FilterKey = "all" | TaskStatus;

export default function TaskFilters({
  tasks,
  value,
  onChange,
}: {
  tasks: Task[];
  value: FilterKey;
  onChange: (v: FilterKey) => void;
}) {
  const total = tasks.length;
  const notStarted = tasks.filter((t) => t.status === "not_started").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-5">
      <CardButton
        title="Total Tasks"
        value={String(total)}
        active={value === "all"}
        onClick={() => onChange("all")}
      />
      <CardButton
        title="Not Started"
        value={String(notStarted)}
        active={value === "not_started"}
        onClick={() => onChange("not_started")}
      />
      <CardButton
        title="In Progress"
        value={String(inProgress)}
        accent="text-blue-600"
        active={value === "in_progress"}
        onClick={() => onChange("in_progress")}
      />
      <CardButton
        title="Completed"
        value={String(completed)}
        accent="text-green-600"
        active={value === "completed"}
        onClick={() => onChange("completed")}
      />
    </div>
  );
}

function CardButton({
  title,
  value,
  accent,
  active,
  onClick,
}: {
  title: string;
  value: string;
  accent?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-left transition",
        "hover:bg-slate-50",
        active ? "ring-1 ring-slate-900/10" : "",
      ].join(" ")}
      aria-pressed={active}
    >
      <div className="text-sm text-slate-500">{title}</div>
      <div className={`mt-2 text-3xl font-semibold ${accent ?? "text-slate-900"}`}>
        {value}
      </div>
    </button>
  );
}
