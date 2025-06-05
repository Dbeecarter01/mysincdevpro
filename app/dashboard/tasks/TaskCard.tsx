'use client';

import { Card } from '@/components/ui/card';

export default function TaskCard({ task }: { task: any }) {
  return (
    <Card className="p-3">
      <p className="font-medium">{task.task_name}</p>
      <p className="text-sm text-gray-500">{task.task_status}</p>
    </Card>
  );
}
