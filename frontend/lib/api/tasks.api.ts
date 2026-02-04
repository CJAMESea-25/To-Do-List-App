import { apiRequest } from "./client";

export type TaskStatus = "not_started" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  dueDate?: string | null;
  tags?: string[];
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const BASE = "/api/todos";

export const getTasks = () =>
  apiRequest<Task[]>(BASE, { auth: true });

export const createTask = (payload: {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  dueDate?: string | null;
}) =>
  apiRequest<Task>(BASE, {
    method: "POST",
    auth: true,
    body: payload,
  });

export const updateTask = (
  id: string,
  payload: Partial<
    Pick<Task, "title" | "description" | "status" | "priority" | "category" | "dueDate" | "deleted">
  >
) =>
  apiRequest<Task>(`${BASE}/${id}`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });

export const deleteTask = (id: string) =>
  apiRequest<{ message: string }>(`${BASE}/${id}`, {
    method: "DELETE",
    auth: true,
  });
