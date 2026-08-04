"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;

      const hasSession = Boolean(data.session);
      setIsAuthenticated(hasSession);
      setIsReady(true);

      if (!hasSession && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
    }

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const next = Boolean(session);
      setIsAuthenticated(next);
      if (!next && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-(--bg-primary) px-4 py-20 text-center text-(--text-primary)">
        Loading admin workspace...
      </div>
    );
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    return null;
  }

  return <div className="min-h-screen bg-(--bg-primary)">{children}</div>;
}
