'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { Dialog } from '@headlessui/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AddTaskModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: () => void;
}) {
  const [taskName, setTaskName] = useState('');

  const handleAdd = async () => {
  if (!taskName.trim()) return;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    alert('User not authenticated');
    return;
  }

  const { error } = await supabase.from('tasks').insert({
    task_name: taskName,
    task_status: 'Todo',
    user_id: user.id,
  });

  if (error) {
    alert('Failed to add task: ' + error.message);
    return;
  }

  onAdd();
  onClose();
};


  return (
    <Dialog open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
      <Dialog.Panel className="bg-black p-6 rounded shadow-lg max-w-sm w-full">
        <Dialog.Title className="text-lg font-bold mb-2 text-white">Add New Task</Dialog.Title>

        <Input
          placeholder="Enter task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="mb-4"
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
