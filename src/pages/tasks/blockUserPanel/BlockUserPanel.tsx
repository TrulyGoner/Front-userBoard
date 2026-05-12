import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios, { AxiosError } from 'axios';
import type { RootState } from '@store';
import { API_BASE_URL, API_ENDPOINTS } from '@shared/config';
import { Button, Input, ErrorAlert } from '@shared/ui';
import type { User } from '@shared/types';
import './BlockUserPanel.scss';

interface BlockUserPanelProps {
  targetUser: User;
  onBlockSuccess?: () => void;
}

interface ErrorResponse {
  message: string;
}

export const BlockUserPanel = ({ targetUser, onBlockSuccess }: BlockUserPanelProps) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || user.id === targetUser.id) {
    return null;
  }

  const handleBlockUser = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for blocking');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.LIST_BLOCKS}`,
        {
          blockerId: user.id,
          blockedUserId: targetUser.id,
          comment: reason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReason('');
      setIsOpen(false);
      onBlockSuccess?.();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'Failed to block user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="block-user-panel">
      <Button
        variant="danger"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        Block User
      </Button>

      {isOpen && (
        <div className="block-user-panel__modal">
          <div className="block-user-panel__content">
            <h3>Block {targetUser.nickname}?</h3>

            {error && <ErrorAlert error={error} onClear={() => setError(null)} />}

            <p className="block-user-panel__warning">
              Are you sure you want to block <strong>{targetUser.nickname}</strong>?
            </p>

            <div className="block-user-panel__form">
              <Input
                type="text"
                placeholder="Reason for blocking (required)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />

              <div className="block-user-panel__actions">
                <Button
                  variant="danger"
                  onClick={handleBlockUser}
                  disabled={!reason.trim() || loading}
                >
                  {loading ? 'Blocking...' : 'Confirm Block'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsOpen(false);
                    setReason('');
                    setError(null);
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
