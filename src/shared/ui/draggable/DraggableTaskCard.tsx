import { useNavigate } from 'react-router-dom';
import type { Task } from '@shared/types';
import './DraggableTaskCard.scss';

interface DraggableTaskCardProps {
  task: Task;
  isDragged: boolean;
  onDragStart: (taskId: string, status: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const DraggableTaskCard = ({
  task,
  isDragged,
  onDragStart,
  onDragEnd,
}: DraggableTaskCardProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    navigate(`/tasks/${task.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/tasks/${task.id}`);
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(task.id, task.status, e)}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`task-card ${isDragged ? 'task-card--dragging' : ''}`}
    >
      <div className="task-card__header">
        <h4>{task.title}</h4>
      </div>

      {task.description && (
        <p className="task-card__description">
          {task.description.substring(0, 60)}
          {task.description.length > 60 ? '...' : ''}
        </p>
      )}

      <div className="task-card__meta">
        <span className={`task-card__badge task-card__badge--priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        {task.assignee && (
          <span className="task-card__badge task-card__badge--assignee">
            {task.assignee.nickname}
          </span>
        )}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="task-card__tags">
          {task.tags.map(tag => (
            <span key={tag.id} className="task-card__tag">
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
