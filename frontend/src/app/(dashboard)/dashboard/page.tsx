"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  return (
    <main className="p-6 bg-white">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-slate-600">You are logged in.</p>
      <p className="bg-white"></p>
    </main>
  );
}
