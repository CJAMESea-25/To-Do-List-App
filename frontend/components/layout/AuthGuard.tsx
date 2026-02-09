"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/api/auth.api";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [ready, setReady] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = isAuthenticated();
    setReady(auth);
    if (!auth) {
      router.replace("/login");
    }
  }, [router]);

  if (ready === null) return null;
  if (!ready) return null;

  return <>{children}</>;
}
