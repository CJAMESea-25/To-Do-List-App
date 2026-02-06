"use client";

import { useMemo, useState } from "react";
import PriorityBadge from "@/components/ui/PriorityBadge";
import StatusDropdown from "@/components/ui/StatusDropdown";
import { X, Flag, Calendar, FolderKanban, CheckCircle2, Plus } from "lucide-react";
import type { TaskPriority, TaskStatus } from "@/lib/api/tasks.api";

type AddTaskPayload = {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string | null; 
  category?: string;
};

export default function AddTaskModal({
  onClose,
  onAdd,
  categories: initialCategories = ["Design", "Engineering", "UI/UX", "Marketing", "Sales", "Report", "Research"],
}: {
  onClose: () => void;
  onAdd: (payload: AddTaskPayload) => Promise<void> | void;
  categories?: string[];
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("not_started");

    const [dueDate, setDueDate] = useState<string>(() => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
    });

  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [category, setCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  const handleAddCategory = () => {
    const value = newCategory.trim();
    if (!value) return;
    if (categories.includes(value)) {
      setCategory(value);
      setNewCategory("");
      setShowAddCategory(false);
      return;
    }
    setCategories((prev) => [...prev, value]);
    setCategory(value);
    setNewCategory("");
    setShowAddCategory(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const payloadDueDate = dueDate || null;

    await onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      dueDate: payloadDueDate,
      category: category.trim() || undefined,
    });

    onClose();
  };

  return (
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
        <button
          onClick={onClose}
          type="button"
          className="absolute right-6 top-6 rounded-lg p-2 transition-colors hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-slate-500" />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900">Add New Task</h2>
          <p className="mt-2 text-sm text-slate-700">Create a new task</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-900">Task Title *</label>
            <input
              type="text"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-900 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-900">Description</label>
            <textarea
              placeholder="Add more details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 w-full resize-none rounded-lg border border-slate-900 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-900">
                <CheckCircle2 className="h-4 w-4 text-slate-900" />
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-lg border border-slate-900 bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-900">
                <Flag className="h-4 w-4 text-slate-900" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-lg border border-slate-900 bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-900">
                <Calendar className="h-4 w-4 text-slate-900" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-900 bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-900">
              <FolderKanban className="h-4 w-4 text-slate-900" />
              Category
            </label>

            {!showAddCategory ? (
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-900 bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowAddCategory(true)}
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-200"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter new category..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCategory();
                    }
                    if (e.key === "Escape") {
                      setShowAddCategory(false);
                      setNewCategory("");
                    }
                  }}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  autoFocus
                />

                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-black hover:opacity-95"
                >
                  Add
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategory("");
                  }}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-900 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-100 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm text-white disabled:opacity-60"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
