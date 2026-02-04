"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { logout } from "@/lib/api/auth.api";
import { getMe } from "@/lib/api/user.api";

export default function Topbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // ✅ user from backend
  const [username, setUsername] = useState<string>(""); // empty while loading
  const email = ""; // you can add email later if your backend returns it

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Fetch logged-in user info from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await getMe();
        if (mounted) setUsername(me.username);
      } catch {
        // If token is invalid/expired, kick back to login
        logout();
        router.replace("/login");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  const initials =
    username
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U";

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>
      {/* ✅ No mx-auto, no left padding => flush left */}
      <header className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur">
        <div className="flex items-center justify-between py-4 pr-6 pl-5">
          {/* ✅ Flush-left Logo/App Name */}
          <Link href="/today" className="flex items-center gap-3 pl-0">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-linear-to-br from-slate-600 to-slate-900">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"  
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <span className="text-lg font-medium text-slate-900">TaskFlow</span>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-100"
            >
              {/* Avatar */}
              <div className="grid h-8 w-8 place-items-center rounded-full bg-linear-to-br from-slate-600 to-slate-900 text-sm font-semibold text-white">
                {initials}
              </div>

              <div className="hidden text-left md:block">
                <div className="text-sm font-medium text-slate-900">
                  {username || "Loading..."}
                </div>
                <div className="text-xs text-slate-500">
                  {email || " "}
                </div>
              </div>

              <ChevronDown className="hidden h-4 w-4 text-slate-500 md:block" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border bg-white shadow-lg">
                <div className="px-4 py-3">
                  <div className="text-xs font-semibold text-slate-500">MY ACCOUNT</div>
                </div>

                <div className="h-px bg-slate-100" />

                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => {
                    setProfileModal(true);
                    setOpen(false);
                  }}
                >
                  <Settings className="h-4 w-4" />
                  Profile Settings
                </button>

                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  <User className="h-4 w-4" />
                  My Profile
                </button>

                <div className="h-px bg-slate-100" />

                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {profileModal && <ProfileSettingsModal onClose={() => setProfileModal(false)} />}
    </>
  );
}

function ProfileSettingsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Profile Settings</h2>
            <p className="mt-1 text-sm text-slate-500">
              (Placeholder) Add your profile settings form here.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
