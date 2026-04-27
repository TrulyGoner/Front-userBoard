import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchTask } from '@store/slices/tasksSlice';
import type { RootState, AppDispatch } from '@store';
import { ErrorAlert } from '@shared/ui';
import { useErrorHandling } from '@shared/hooks';
import './TaskDetail.scss';

export const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentTask, loading } = useSelector((state: RootState) => state.tasks);
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
      <h2>{currentTask.title}</h2>
      <div className="task-detail__info">
        <p><strong>Status:</strong> {currentTask.status}</p>
        <p><strong>Priority:</strong> {currentTask.priority}</p>
        <p><strong>Visibility:</strong> {currentTask.visibility}</p>
        {currentTask.description && (
          <p><strong>Description:</strong> {currentTask.description}</p>
        )}
      </div>
    </div>
  );
};
