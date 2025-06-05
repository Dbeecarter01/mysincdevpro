'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";



export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.push("/dashboard");
      } else {
        router.push("/auth");
      }
    }

    checkSession();
  }, [router]);

  return <p>Redirecting...</p>;
}

