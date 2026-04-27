import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createTask, updateTask } from '@store/slices/tasksSlice';
import type { RootState, AppDispatch } from '@store';
import { Button, Input, Select, ErrorAlert } from '@shared/ui';
import { useErrorHandling } from '@shared/hooks';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, VISIBILITY_OPTIONS, type TaskFormData } from '../shared';
import './TaskForm.scss';

export const TaskForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, currentTask } = useSelector((state: RootState) => state.tasks);
  const { error, clearError } = useErrorHandling('tasks');
  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
    defaultValues: currentTask ? {
      title: currentTask.title,
      description: currentTask.description,
      status: currentTask.status,
      priority: currentTask.priority,
      visibility: currentTask.visibility,
    } : {}
  });

  const onSubmit = (data: TaskFormData) => {
    if (id) {
      dispatch(updateTask({ id, task: data }));
    } else {
      dispatch(createTask(data));
    }
    navigate('/tasks');
  };

  return (
    <div className="task-form">
      <div className="task-form__container">
        <h2>{id ? 'Edit Task' : 'Create New Task'}</h2>

        {error && <ErrorAlert error={error} onClear={clearError} />}

        <form onSubmit={handleSubmit(onSubmit)} className="task-form__form">
          <Input
            label="Title"
            type="text"
            placeholder="Task title"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />

          <div className="task-form__textarea-wrapper">
            <label htmlFor="description" className="task-form__label">Description</label>
            <textarea
              id="description"
              placeholder="Task description (optional)"
              className="task-form__textarea"
              {...register('description')}
            />
          </div>

          <div className="task-form__row">
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              {...register('status')}
            />
            <Select
              label="Priority"
              options={PRIORITY_OPTIONS}
              {...register('priority')}
            />
          </div>

          <Select
            label="Visibility"
            options={VISIBILITY_OPTIONS}
            {...register('visibility')}
          />

          <div className="task-form__actions">
            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update Task' : 'Create Task')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => navigate('/tasks')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
