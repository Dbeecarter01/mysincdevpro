'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '@/app/lib/supabaseClient';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddTaskModal from './AddTaskModal';
import { X } from 'lucide-react';

type TaskStatus = 'Todo' | 'Pending' | 'Done';

interface Task {
  id: string;
  task_name: string;
  task_status: TaskStatus;
}

const columnColors: Record<TaskStatus, string> = {
  Todo: 'bg-blue-50 border-blue-200',
  Pending: 'bg-yellow-50 border-yellow-200',
  Done: 'bg-green-50 border-green-200',
};

const cardColors: Record<TaskStatus, string> = {
  Todo: 'bg-blue-100 text-blue-900',
  Pending: 'bg-yellow-100 text-yellow-900',
  Done: 'bg-green-100 text-green-900',
};

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Record<TaskStatus, Task[]>>({
    Todo: [],
    Pending: [],
    Done: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [recentlyMoved, setRecentlyMoved] = useState<string | null>(null);

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*');
    const grouped: Record<TaskStatus, Task[]> = { Todo: [], Pending: [], Done: [] };
    data?.forEach((task) => {
      const rawStatus = (task.task_status ?? '').toLowerCase();
      let status: TaskStatus;

      if (rawStatus === 'todo') status = 'Todo';
      else if (rawStatus === 'pending') status = 'Pending';
      else if (rawStatus === 'done') status = 'Done';
      else status = 'Todo';

      grouped[status].push({
        id: task.id,
        task_name: task.task_name,
        task_status: status,
      });
    });
    setTasks(grouped);
  };

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    await supabase.from('tasks').update({ task_status: newStatus }).eq('id', taskId);
  };

  const deleteTask = async (taskId: string) => {
    await supabase.from('tasks').delete().eq('id', taskId);
    fetchTasks();
  };

  const onDragEnd = async (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId as TaskStatus;
    const destCol = destination.droppableId as TaskStatus;

    if (sourceCol === destCol) return;

    const movedTask = tasks[sourceCol][source.index];

    const updatedSource = Array.from(tasks[sourceCol]);
    updatedSource.splice(source.index, 1);

    const updatedDest = Array.from(tasks[destCol]);
    const updatedMovedTask = { ...movedTask, task_status: destCol };
    updatedDest.splice(destination.index, 0, updatedMovedTask);

    setTasks({
      ...tasks,
      [sourceCol]: updatedSource,
      [destCol]: updatedDest,
    });

    setRecentlyMoved(movedTask.id);
    setTimeout(() => setRecentlyMoved(null), 2000); // Flash duration

    await updateTaskStatus(movedTask.id, destCol);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onAdd={fetchTasks}
        />
      )}
      <div className="flex justify-between gap-4 mt-8">
        <DragDropContext onDragEnd={onDragEnd}>
          {(['Todo', 'Pending', 'Done'] as TaskStatus[]).map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-lg p-4 flex-1 min-h-[400px] border shadow-sm ${columnColors[status]}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-black">{status}</h2>
                    <Button variant="ghost" onClick={() => setShowModal(true)} className="text-black">
                      +
                    </Button>
                  </div>
                  {tasks[status].map((task, index) => {
                    const isFlashing = recentlyMoved === task.id && task.task_status !== 'Done';
                    return (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-3 p-4 rounded-lg shadow border flex justify-between items-center transition-all duration-300 ${
                              cardColors[task.task_status]
                            } ${isFlashing ? 'ring-2 ring-indigo-500' : ''}`}
                          >
                            <span>{task.task_name}</span>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-red-600 hover:text-red-800 ml-2"
                              title="Delete"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </Card>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </>
  );
}
