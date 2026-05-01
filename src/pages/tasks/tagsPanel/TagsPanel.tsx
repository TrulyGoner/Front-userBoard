import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios, { AxiosError } from 'axios';
import type { RootState, AppDispatch } from '@store';
import { fetchTask } from '@store/slices/tasksSlice';
import { API_BASE_URL, API_ENDPOINTS } from '@shared/config';
import { Button, Input, ErrorAlert } from '@shared/ui';
import type { Task } from '@shared/types';
import './TagsPanel.scss';

interface TagsPanelProps {
  task: Task;
}

export const TagsPanel = ({ task }: TagsPanelProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
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
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.TASKS.ADD_TAG(task.id)}`,
        { name: newTag.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTag('');
      dispatch(fetchTask(task.id));
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Failed to add tag');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.TASKS.REMOVE_TAG(task.id, tagId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(fetchTask(task.id));
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Failed to remove tag');
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
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddTag();
              }
            }}
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
