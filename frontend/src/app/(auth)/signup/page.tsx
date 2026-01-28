"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await signup(username, password);
      router.push("/login");
    } catch (error: unknown) {
  if (error instanceof Error) {
    setErr(error.message);
  } else {
    setErr('An error occurred');
  }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-800 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <h1 className="text-2xl text-black font-semibold">Sign up</h1>

        <input
          className="mt-5 w-full rounded-lg border px-3 py-2 text-gray-700"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="mt-3 w-full rounded-lg border px-3 py-2 text-gray-700"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

        <button
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-slate-900 py-2 font-medium text-white disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account? <a className="underline" href="/login">Login</a>
        </p>
      </form>
    </main>
  );
}
