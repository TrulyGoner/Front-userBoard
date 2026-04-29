import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTaskStatus } from '@store/slices/tasksSlice';
import type { RootState, AppDispatch } from '@store';
import { Link } from 'react-router-dom';
import { Button } from '@shared/ui';
import { DraggableTaskCard } from './DraggableTaskCard';
import './TaskBoard.scss';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

export const TaskBoard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const { token } = useSelector((state: RootState) => state.auth);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [draggedTaskStatus, setDraggedTaskStatus] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);

  const filteredTasks = useMemo(() => ({
    TODO: tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter(t => t.status === 'DONE'),
  }), [tasks]);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchTasks({ pageSize: 100 }));
  }, [dispatch, token]);

  const handleDragStart = (taskId: string, status: string, e: React.DragEvent<HTMLDivElement>) => {
    
    if (!e.dataTransfer) {
      return;
    }

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    
    setDraggedTaskId(taskId);
    setDraggedTaskStatus(status);;
  };

  const handleDragOver = (status: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    setDragOverStatus(status);
  };

  const handleDrop = (newStatus: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverStatus(null);

    
    if (!draggedTaskId || draggedTaskStatus === newStatus) {
      console.warn('⚠️ Drop cancelled:', { draggedTaskId, sameStatus: draggedTaskStatus === newStatus });
      setDraggedTaskId(null);
      setDraggedTaskStatus(null);
      return;
    }

    
    dispatch(updateTaskStatus({
      id: draggedTaskId,
      status: newStatus as 'TODO' | 'IN_PROGRESS' | 'DONE'
    }));

    setDraggedTaskId(null);
    setDraggedTaskStatus(null);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if ((e.relatedTarget as HTMLElement)?.closest('.task-board__tasks') !== e.currentTarget) {
      setDragOverStatus(null);
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedTaskId(null);
    setDraggedTaskStatus(null);
    setDragOverStatus(null);
  };

  if (!token) {
    return <div className="task-board">Please login to view tasks.</div>;
  }

  return (
    <div className="task-board">
      <div className="task-board__header">
        <div className="task-board__title-section">
          <h2>Task Board (Kanban View)</h2>
          <div className="task-board__view-toggle">
            <Link to="/tasks">
              <Button variant="secondary" size="sm">List View</Button>
            </Link>
            <Button variant="primary" size="sm" disabled>Board View</Button>
          </div>
        </div>
        <Link to="/tasks/new">
          <Button variant="primary">Create New Task</Button>
        </Link>
      </div>

      {loading && <div className="task-board__loading">Loading...</div>}

      <div className="task-board__columns">
        {STATUSES.map(status => (
          <div
            key={status}
            className="task-board__column"
          >
            <div className="task-board__column-header">
              <h3>{status.replace(/_/g, ' ')}</h3>
              <span className="task-board__column-count">
                {filteredTasks[status as keyof typeof filteredTasks].length}
              </span>
            </div>

            <div 
              className={`task-board__tasks ${dragOverStatus === status ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(status, e)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(status, e)}
            >
              {filteredTasks[status as keyof typeof filteredTasks].length === 0 ? (
                <div className="task-board__empty">No tasks</div>
              ) : (
                filteredTasks[status as keyof typeof filteredTasks].map(task => (
                  <DraggableTaskCard
                    key={task.id}
                    task={task}
                    isDragged={draggedTaskId === task.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
