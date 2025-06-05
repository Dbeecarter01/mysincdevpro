'use client';

import TaskCard from './TaskCard';

export default function TaskColumn({ title, tasks }: { title: string; tasks: any[] }) {
  return (
    <div className="flex-1 p-2">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
