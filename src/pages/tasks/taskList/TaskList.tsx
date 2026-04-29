import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '@store';
import { updateTaskStatus } from '@store/slices/tasksSlice';
import { ErrorAlert, EmptyState, Button } from '@shared/ui';
import { useErrorHandling } from '@shared/hooks';
import type { Task } from '@shared/types';
import { TaskFilters } from '../taskFilter/TaskFilters';
import './TaskList.scss';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

export const TaskList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const { token } = useSelector((state: RootState) => state.auth);
  const { error, clearError } = useErrorHandling('tasks');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [draggedTaskStatus, setDraggedTaskStatus] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);

  const kanbanTasks = useMemo(() => {
    const grouped: Record<string, Task[]> = {
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
    };
    tasks.forEach(task => {
      const status = task.status as keyof typeof grouped;
      if (grouped[status]) {
        grouped[status].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  const handleDragStart = (taskId: string, status: string, e: React.DragEvent<HTMLAnchorElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
    setDraggedTaskStatus(status);
  };

  const handleDragOver = (status: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    setDragOverStatus(status);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if ((e.relatedTarget as HTMLElement)?.closest('.task-list__kanban-cards') !== e.currentTarget) {
      setDragOverStatus(null);
    }
  };

  const handleDrop = (newStatus: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverStatus(null);
    
    if (!draggedTaskId || draggedTaskStatus === newStatus) {
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

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDraggedTaskStatus(null);
    setDragOverStatus(null);
  };

  if (!token) {
    return <div className="task-list">Please login to view tasks.</div>;
  }

  return (
    <div className="task-list">
      <div className="task-list__container">
        <aside className="task-list__sidebar">
          <TaskFilters />
        </aside>
        <main className="task-list__main">
          <div className="task-list__header">
            <div className="task-list__view-controls">
              <Button 
                variant={viewMode === 'list' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
              <Button 
                variant={viewMode === 'kanban' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                Kanban
              </Button>
            </div>
          </div>

          {loading && <div className="task-list__loading">Loading...</div>}

          {error && <ErrorAlert error={error} onClear={clearError} />}

          {!loading && tasks.length === 0 ? (
            <EmptyState 
              title="No tasks found"
              description="Try adjusting your filters or create a new one!"
            />
          ) : viewMode === 'list' ? (
            <ul className="task-list__items">
              {tasks.map((task) => (
                <li key={task.id} className="task-list__item">
                  <Link to={`/tasks/${task.id}`} className="task-list__link">
                    <div className="task-list__title-section">
                      <h3>{task.title}</h3>
                      {task.assignee && (
                        <span className="task-list__assignee">
                          Assigned to: {task.assignee.nickname}
                        </span>
                      )}
                    </div>
                    <div className="task-list__meta">
                      <span className={`task-list__status task-list__status--${task.status.toLowerCase()}`}>
                        {task.status}
                      </span>
                      <span className={`task-list__priority task-list__priority--${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="task-list__kanban">
              {STATUSES.map((status) => (
                <div key={status} className="task-list__kanban-column">
                  <div className="task-list__kanban-header">
                    <h3>{status.replace(/_/g, ' ')}</h3>
                    <span className="task-list__kanban-count">
                      {kanbanTasks[status as keyof typeof kanbanTasks].length}
                    </span>
                  </div>
                  <div 
                    className={`task-list__kanban-cards ${dragOverStatus === status ? 'drag-over' : ''}`}
                    onDragOver={(e) => handleDragOver(status, e)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(status, e)}
                  >
                    {kanbanTasks[status as keyof typeof kanbanTasks].length === 0 ? (
                      <div className="task-list__kanban-empty">No tasks</div>
                    ) : (
                      kanbanTasks[status as keyof typeof kanbanTasks].map((task) => (
                        <Link
                          key={task.id}
                          to={`/tasks/${task.id}`}
                          draggable
                          onDragStart={(e) => handleDragStart(task.id, task.status, e)}
                          onDragEnd={handleDragEnd}
                          className={`task-list__kanban-card ${draggedTaskId === task.id ? 'dragging' : ''}`}
                          onClick={(e) => {
                            if (draggedTaskId) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <div className="task-list__kanban-card-title">
                            <h4>{task.title}</h4>
                          </div>
                          {task.description && (
                            <p className="task-list__kanban-card-desc">
                              {task.description.substring(0, 60)}
                              {task.description.length > 60 ? '...' : ''}
                            </p>
                          )}
                          <div className="task-list__kanban-card-meta">
                            <span className={`task-list__kanban-badge task-list__kanban-badge--${task.priority.toLowerCase()}`}>
                              {task.priority}
                            </span>
                            {task.assignee && (
                              <span className="task-list__kanban-assignee">
                                {task.assignee.nickname}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
