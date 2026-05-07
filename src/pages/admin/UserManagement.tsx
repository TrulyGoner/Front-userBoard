import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@store';
import { adminApiService, type UserWithBanned } from '@shared/services';
import { Button, ErrorAlert, Input } from '@shared/ui';
import { UserManagementLoading, UserManagementEmpty } from './components';
import './UserManagement.scss';

export const UserManagement = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<UserWithBanned[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);

    try {
      const data = await adminApiService.fetchUsers(token);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleBanUser = async (userId: string) => {
    if (!token) return;
    
    try {
      await adminApiService.banUser(userId, token);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId: string) => {
    if (!token) return;
    
    try {
      await adminApiService.unbanUser(userId, token);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unban user');
    }
  };

  const handleGrantAdminRole = async (userId: string) => {
    if (!token) return;
    
    try {
      await adminApiService.grantAdminRole(userId, token);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to grant admin role');
    }
  };

  const handleRevokeAdminRole = async (userId: string) => {
    if (!token) return;
    
    try {
      await adminApiService.revokeAdminRole(userId, token);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke admin role');
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

      <UserManagementLoading isLoading={loading} />

      {!loading && (
        <>
          <UserManagementEmpty isEmpty={filteredUsers.length === 0} />

          {filteredUsers.length > 0 && (
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
                              <>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleBanUser(u.id)}
                                >
                                  Ban
                                </Button>
                                {u.role === 'USER' ? (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleGrantAdminRole(u.id)}
                                  >
                                    Make Admin
                                  </Button>
                                ) : (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleRevokeAdminRole(u.id)}
                                  >
                                    Revoke Admin
                                  </Button>
                                )}
                              </>
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
        </>
      )}
    </div>
  );
};
