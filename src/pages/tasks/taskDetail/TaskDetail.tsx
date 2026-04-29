import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchTask } from '@store/slices/tasksSlice';
import type { RootState, AppDispatch } from '@store';
import { Button, ErrorAlert } from '@shared/ui';
import { useErrorHandling } from '@shared/hooks';
import { AssignmentPanel, TagsPanel, BlockUserPanel } from '../shared';
import './TaskDetail.scss';

export const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentTask, loading } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);
  const { error, clearError } = useErrorHandling('tasks');

  useEffect(() => {
    if (!id) return;
    dispatch(fetchTask(id));
  }, [dispatch, id]);

  if (loading) return <div className="task-detail__loading">Loading...</div>;

  if (error) {
    return (
      <div className="task-detail">
        <ErrorAlert error={error} onClear={clearError} />
      </div>
    );
  }

  if (!currentTask) {
    return <div className="task-detail">Task not found.</div>;
  }

  return (
    <div className="task-detail">
      <div className="task-detail__header">
        <Link to="/tasks">
          <Button variant="secondary" size="sm">← Back to Tasks</Button>
        </Link>
        <div className="task-detail__actions">
          <Link to={`/tasks/${id}/edit`}>
            <Button variant="primary" size="sm">Edit Task</Button>
          </Link>
          {currentTask.creator?.id !== user?.id && (
            <BlockUserPanel targetUser={currentTask.creator!} />
          )}
        </div>
      </div>
      <h2>{currentTask.title}</h2>
      
      <div className="task-detail__content">
        <div className="task-detail__main">
          <div className="task-detail__info">
            <p><strong>Status:</strong> {currentTask.status}</p>
            <p><strong>Priority:</strong> {currentTask.priority}</p>
            <p><strong>Visibility:</strong> {currentTask.visibility}</p>
            {currentTask.creator && <p><strong>Created by:</strong> {currentTask.creator.nickname}</p>}
            {currentTask.description && (
              <p><strong>Description:</strong> {currentTask.description}</p>
            )}
          </div>
        </div>
        
        <aside className="task-detail__sidebar">
          {currentTask && <AssignmentPanel task={currentTask} currentUserId={user?.id} />}
          {currentTask && <TagsPanel task={currentTask} />}
        </aside>
      </div>
    </div>
  );
};

