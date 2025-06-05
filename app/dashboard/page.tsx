'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';
import TasksPage from './TasksPage';

export default function Tasks() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!data.session) {
        router.push('/login'); // 👈 redirect to login if no session
      } else {
        setLoading(false); // ✅ user is authenticated
      }
    };

    getSession();
  }, []);

  if (loading) return <p>Loading...</p>;
  return <TasksPage />;
}
