import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios, { AxiosError } from 'axios';
import type { RootState } from '@store';
import { API_BASE_URL, API_ENDPOINTS } from '@shared/config';
import { Button, ErrorAlert, Input } from '@shared/ui';
import type { User } from '@shared/types';
import './UserManagement.scss';

interface UserWithBanned extends User {
  bannedAt?: string | null;
}

interface ErrorResponse {
  message: string;
}

export const UserManagement = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<UserWithBanned[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.USERS_LIST}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleBanUser = async (userId: string) => {
    try {
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.BAN_USER(userId)}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUsers();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.ADMIN.UNBAN_USER(userId)}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUsers();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'Failed to unban user');
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="user-management">
        <div className="user-management__error">
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u =>
    u.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="user-management">
      <h2>User Management</h2>

      {error && <ErrorAlert error={error} onClear={() => setError(null)} />}

      <div className="user-management__search">
        <Input
          type="text"
          placeholder="Search by nickname or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && <div className="user-management__loading">Loading...</div>}

      {!loading && filteredUsers.length === 0 ? (
        <div className="user-management__empty">No users found</div>
      ) : (
        <div className="user-management__table">
          <table>
            <thead>
              <tr>
                <th>Nickname</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className={u.bannedAt ? 'user-management__row--banned' : ''}>
                  <td>{u.nickname}</td>
                  <td>{u.email || '-'}</td>
                  <td>
                    <span className={`user-management__badge user-management__badge--${u.role.toLowerCase()}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {u.bannedAt ? (
                      <span className="user-management__status user-management__status--banned">Banned</span>
                    ) : (
                      <span className="user-management__status user-management__status--active">Active</span>
                    )}
                  </td>
                  <td>
                    {u.id !== user.id && (
                      <div className="user-management__actions">
                        {u.bannedAt ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleUnbanUser(u.id)}
                          >
                            Unban
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleBanUser(u.id)}
                          >
                            Ban
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
