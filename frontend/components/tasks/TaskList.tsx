"use client";

import type { Task, TaskPriority, TaskStatus } from "@/lib/api/tasks.api";
import TaskCard from "@/components/tasks/TaskCard";

export default function TaskList({
  tasks,
  onChangeStatus,
  onDelete,
  onChangePriority,
  onChangeCategory,
  onPressTask,
}: {
  tasks: Task[];
  onChangeStatus: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onChangePriority?: (id: string, priority: TaskPriority) => void;
  onChangeCategory?: (id: string, category: string) => void;
  onPressTask?: (task: Task) => void;
}) {
  return (
    <div className="space-y-6">
      {tasks.map((t) => (
        <TaskCard
          key={t._id}
          task={t}
          onPress={onPressTask}
          onChangeStatus={(status) => onChangeStatus(t._id, status)}
          onDelete={() => onDelete(t._id)}
          onChangePriority={
            onChangePriority ? (p) => onChangePriority(t._id, p) : undefined
          }
          onChangeCategory={
            onChangeCategory ? (c) => onChangeCategory(t._id, c) : undefined
          }
        />
      ))}
    </div>
  );
}
