'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import TaskBoard from '@/app/dashboard/tasks/TaskBoard';
import { Button } from '@/components/ui/button';

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = '/auth';
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        setUserEmail(user?.email ?? 'User');
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tasks Pipeline</h1>
          <div className="flex items-center gap-4 bg-white shadow px-4 py-1 rounded-full text-sm text-gray-700">
            <span>Welcome, {userEmail} 👋</span>
            <Button
              onClick={handleLogout}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              Logout
            </Button>
          </div>
        </div>

        <TaskBoard />
      </div>
    </main>
  );
}
