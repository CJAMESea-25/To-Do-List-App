// components/layout/ProfileSettingsModal.tsx
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getMe, updateUsername } from "@/lib/api/user.api";
import { changePassword, logout } from "@/lib/api/auth.api";
import { ApiError } from "@/lib/api/client";

export default function ProfileSettingsModal({
  onClose,
  onAuthFail,
}: {
  onClose: () => void;
  onAuthFail?: () => void; // optional: redirect to /login in parent
}) {
  const [loading, setLoading] = useState(true);

  // Username form
  const [username, setUsername] = useState("");
  const [usernameSaving, setUsernameSaving] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Messages
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setErr("");
        setOk("");
        setLoading(true);
        const me = await getMe();
        if (!alive) return;
        setUsername(me.username || "");
      } catch {
        logout();
        onAuthFail?.();
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [onAuthFail]);

  const saveUsername = async () => {
    const next = username.trim();
    if (!next) {
      setErr("Username cannot be empty.");
      return;
    }

    try {
      setErr("");
      setOk("");
      setUsernameSaving(true);
      await updateUsername({ username: next });
      setOk("Username updated.");
    } catch (e) {
    const message =
        e instanceof ApiError ? e.message : "Failed to update username.";
    setErr(message);
    }
    finally {
      setUsernameSaving(false);
    }
  };

  const savePassword = async () => {
    if (!currentPassword || !newPassword) {
      setErr("Please fill in current and new password.");
      return;
    }
    if (newPassword.length < 6) {
      setErr("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErr("New passwords do not match.");
      return;
    }

    try {
      setErr("");
      setOk("");
      setPasswordSaving(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      setOk("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (e) {
    const message =
        e instanceof ApiError ? e.message : "Failed to change password.";
    setErr(message);
    }
    finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Profile Settings</h2>
            <p className="mt-1 text-sm text-slate-500">Update username and password</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : (
            <>
              {(err || ok) && (
                <div
                  className={[
                    "mb-4 rounded-xl border p-3 text-sm",
                    err
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-green-200 bg-green-50 text-green-700",
                  ].join(" ")}
                >
                  {err || ok}
                </div>
              )}

              {/* Username */}
              <section className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-900">Change Username</h3>
                <p className="mt-1 text-sm text-slate-500">This updates how your name appears in the app.</p>

                <div className="mt-4 space-y-2">
                  <label className="text-sm text-slate-700">Username</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={usernameSaving}
                    onClick={saveUsername}
                    className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm text-white disabled:opacity-60"
                  >
                    {usernameSaving ? "Saving..." : "Save Username"}
                  </button>
                </div>
              </section>

              {/* Password */}
              <section className="mt-4 rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-900">Change Password</h3>
                <p className="mt-1 text-sm text-slate-500">Use a strong password you don’t reuse elsewhere.</p>

                <div className="mt-4 grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-700">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-700">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-700">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={passwordSaving}
                    onClick={savePassword}
                    className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm text-white disabled:opacity-60"
                  >
                    {passwordSaving ? "Saving..." : "Save Password"}
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
