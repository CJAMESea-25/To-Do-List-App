"use client";

import { useMemo, useState } from "react";
import { X, Flag, Calendar, FolderKanban, CheckCircle2, Plus } from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from "@/lib/api/tasks.api";

type EditUpdates = {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string | null;
  category?: string;
};

function toDateInputValue(dueDate?: string | null) {
  if (!dueDate) return "";
  // accept "YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return dueDate;
  // accept ISO
  const d = new Date(dueDate);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function EditTaskModal({
  task,
  onClose,
  onSave,
  categories: initialCategories = ["Design", "Engineering"],
}: {
  task: Task;
  onClose: () => void;
  onSave: (taskId: string, updates: EditUpdates) => Promise<void> | void;
  categories?: string[];
}) {
  const [title, setTitle] = useState(task.title ?? "");
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task.priority ?? "medium");
  const [status, setStatus] = useState<TaskStatus>(task.status ?? "not_started");
  const [dueDate, setDueDate] = useState<string>(() => toDateInputValue(task.dueDate));
  const [category, setCategory] = useState(task.category ?? "");
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  const handleAddCategory = () => {
    const v = newCategory.trim();
    if (!v) return;
    if (!categories.includes(v)) setCategories((prev) => [...prev, v]);
    setCategory(v);
    setNewCategory("");
    setShowAddCategory(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    await onSave(task._id, {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      dueDate: dueDate ? dueDate : null,
      category: category.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onMouseDown={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-white/90 p-8 shadow-2xl backdrop-blur-xl"
        onMouseDown={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.08)" }}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute right-6 top-6 rounded-lg p-2 hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-slate-500" />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900">Edit Task</h2>
          <p className="mt-2 text-sm text-slate-500">Update task details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm text-slate-700">Task Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm text-slate-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="min-h-24 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {/* Status / Priority / Due Date */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-slate-400" /> Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <Flag className="h-4 w-4 text-slate-400" /> Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <Calendar className="h-4 w-4 text-slate-400" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <FolderKanban className="h-4 w-4 text-slate-400" /> Category
            </label>

            {!showAddCategory ? (
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
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
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="Enter new category..."
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:opacity-95"
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

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
