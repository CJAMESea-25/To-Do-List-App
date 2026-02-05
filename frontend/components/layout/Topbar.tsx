"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";

import { logout } from "@/lib/api/auth.api";
import { getMe } from "@/lib/api/user.api";

import MyProfileModal from "@/components/layout/MyProfileModal";
import ProfileSettingsModal from "@/components/layout/ProfileSettingsModal";

export default function Topbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const [username, setUsername] = useState<string>("");

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Fetch user
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await getMe();
        if (mounted) setUsername(me.username);
      } catch {
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
      <header className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur">
        <div className="flex items-center justify-between py-4 pr-6 pl-5">
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

          {/* Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-100"
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-linear-to-br from-slate-600 to-slate-900 text-sm font-semibold text-white">
                {initials}
              </div>

              <div className="hidden text-left md:block">
                <div className="text-sm font-medium text-slate-900">
                  {username || "Loading..."}
                </div>
              </div>

              <ChevronDown className="hidden h-4 w-4 text-slate-500 md:block" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-lg">
                <div className="px-4 py-3 text-xs font-semibold text-slate-500">
                  MY ACCOUNT
                </div>

                <div className="h-px bg-slate-100" />

                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
                  onClick={() => {
                    setShowSettings(true);
                    setOpen(false);
                  }}
                >
                  <Settings className="h-4 w-4" />
                  Profile Settings
                </button>

                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
                  onClick={() => {
                    setShowProfile(true);
                    setOpen(false);
                  }}
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

      {showProfile && (
        <MyProfileModal
          username={username}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showSettings && (
        <ProfileSettingsModal
          onClose={() => setShowSettings(false)}
          onAuthFail={() => router.replace("/login")}
        />
      )}
    </>
  );
}
