import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@store';
import { fetchTask } from '@store/slices/tasksSlice';
import { tasksAPI } from '@shared/services';
import { Button, Input, ErrorAlert } from '@shared/ui';
import type { Task } from '@shared/types';
import './TagsPanel.scss';

interface TagsPanelProps {
  task: Task;
}

export const TagsPanel = ({ task }: TagsPanelProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTag = async () => {
    if (!newTag.trim()) {
      setError('Tag name cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await tasksAPI.addTag(task.id, newTag.trim());
      setNewTag('');
      dispatch(fetchTask(task.id));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add tag');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewTag(e.target.value);
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  const handleRemoveTag = async (tagId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await tasksAPI.removeTag(task.id, tagId);
      dispatch(fetchTask(task.id));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to remove tag');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tags-panel">
      <h3>Tags</h3>

      {error && <ErrorAlert error={error} onClear={() => setError(null)} />}

      <div className="tags-panel__content">
        <div className="tags-panel__list">
          {task.tags && task.tags.length > 0 ? (
            task.tags.map(tag => (
              <div key={tag.id} className="tags-panel__tag">
                <span className="tags-panel__tag-name">{tag.name}</span>
                <button
                  className="tags-panel__remove-btn"
                  onClick={() => handleRemoveTag(tag.id)}
                  disabled={loading}
                  title="Remove tag"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <p className="tags-panel__empty">No tags yet</p>
          )}
        </div>

        <div className="tags-panel__add-form">
          <Input
            type="text"
            placeholder="New tag name"
            value={newTag}
            onChange={handleTagInputChange}
            onKeyPress={handleTagInputKeyPress}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddTag}
            disabled={!newTag.trim() || loading}
          >
            Add Tag
          </Button>
        </div>
      </div>
    </div>
  );
};
