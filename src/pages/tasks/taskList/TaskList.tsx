import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '@store/slices/tasksSlice';
import type { RootState, AppDispatch } from '@store';
import { Link } from 'react-router-dom';
import { Button, ErrorAlert } from '@shared/ui';
import { useErrorHandling } from '@shared/hooks';
import './TaskList.scss';

export const TaskList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const { token } = useSelector((state: RootState) => state.auth);
  const { error, clearError } = useErrorHandling('tasks');

  useEffect(() => {
    if (!token) return;
    dispatch(fetchTasks({}));
  }, [dispatch, token]);

  if (!token) {
    return <div className="task-list">Please login to view tasks.</div>;
  }

  return (
    <div className="task-list">
      <div className="task-list__header">
        <h2>Tasks</h2>
        <Link to="/tasks/new">
          <Button variant="primary">Create New Task</Button>
        </Link>
      </div>

      {loading && <div className="task-list__loading">Loading...</div>}

      {error && <ErrorAlert error={error} onClear={clearError} />}

      {!loading && tasks.length === 0 ? (
        <div className="task-list__empty">
          <p>No tasks yet. Create one to get started!</p>
        </div>
      ) : (
        <ul className="task-list__items">
          {tasks.map((task) => (
            <li key={task.id} className="task-list__item">
              <Link to={`/tasks/${task.id}`} className="task-list__link">
                <h3>{task.title}</h3>
                <p className="task-list__status">Status: <span>{task.status}</span></p>
                <p className="task-list__priority">Priority: <span>{task.priority}</span></p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
