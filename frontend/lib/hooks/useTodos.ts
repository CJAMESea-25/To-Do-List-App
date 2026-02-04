"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Task,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/lib/api/tasks.api";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (payload: Parameters<typeof createTask>[0]) => {
    const newTask = await createTask(payload);
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const patch = useCallback(
    async (id: string, payload: Parameters<typeof updateTask>[1]) => {
      const updated = await updateTask(id, payload);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      return updated;
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  }, []);

  return useMemo(
    () => ({ tasks, loading, err, refresh, add, patch, remove }),
    [tasks, loading, err, refresh, add, patch, remove]
  );
}
