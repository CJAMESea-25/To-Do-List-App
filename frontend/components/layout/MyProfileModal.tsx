"use client";

import { useMemo } from "react";

export default function MyProfileModal({
  onClose,
  username,
}: {
  onClose: () => void;
  username: string;
}) {
  const initials = useMemo(() => {
    return (
      username
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("") || "U"
    );
  }, [username]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">My Profile</h2>
            <p className="mt-1 text-sm text-slate-500">Account overview</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <div className="mt-6 flex items-center gap-4">
          {/* ✅ Same avatar style as Topbar */}
          <div className="grid h-12 w-12 place-items-center rounded-full bg-linear-to-br from-slate-600 to-slate-900 text-sm font-semibold text-white">
            {initials}
          </div>

          <div>
            <div className="text-base font-semibold text-slate-900">
              {username || "Loading..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
