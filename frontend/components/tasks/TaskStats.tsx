"use client";

import type { Task } from "@/lib/api/tasks.api";

export default function TaskStats({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const notStarted = tasks.filter((t) => t.status === "not_started").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card title="Total Tasks" value={String(total)} />
      <Card title="Not Started" value={String(notStarted)} />
      <Card title="In Progress" value={String(inProgress)} accent="text-blue-600" />
      <Card title="Completed" value={String(completed)} accent="text-green-600" />
    </div>
  );
}

function Card({
  title,
  value,
  accent,
}: {
  title: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className={`mt-2 text-3xl font-semibold ${accent ?? "text-slate-900"}`}>
        {value}
      </div>
    </div>
  );
}
