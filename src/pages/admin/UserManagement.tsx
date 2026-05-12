import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@store';
import { adminApiService, type UserWithBanned } from '@shared/services';
import { useError } from '@shared/contexts';
import { Input, UsersTable } from '@shared/ui';
import { createUserManagementConfig } from '@shared/utils/tableConfigs';
import { UserManagementLoading, UserManagementEmpty } from './components';
import './UserManagement.scss';

export const UserManagement = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { emitError } = useError();
  const [users, setUsers] = useState<UserWithBanned[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);

    try {
      const data = await adminApiService.fetchUsers(token);
      setUsers(data);
    } catch (err) {
      emitError(err);
    } finally {
      setLoading(false);
    }
  }, [token, emitError]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleBanUser = async (userId: string) => {
    if (!token) return;
    
    try {
      await adminApiService.banUser(userId, token);
      await fetchUsers();
    } catch (err) {
      emitError(err);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    if (!token) return;
    
    try {
      await adminApiService.unbanUser(userId, token);
      await fetchUsers();
    } catch (err) {
      emitError(err);
    }
  };

  const handleGrantAdminRole = async (userId: string) => {
    if (!token) return;
    
    try {
      await adminApiService.grantAdminRole(userId, token);
      await fetchUsers();
    } catch (err) {
      emitError(err);
    }
  };

  const handleRevokeAdminRole = async (userId: string) => {
    if (!token) return;
    
    try {
      await adminApiService.revokeAdminRole(userId, token);
      await fetchUsers();
    } catch (err) {
      emitError(err);
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

  const tableConfig = useMemo(() => 
    createUserManagementConfig({
      currentUserId: user?.id,
      onBan: handleBanUser,
      onUnban: handleUnbanUser,
      onGrantAdmin: handleGrantAdminRole,
      onRevokeAdmin: handleRevokeAdminRole,
    }),
    [user?.id]
  );

  return (
    <div className="user-management">
      <h2>User Management</h2>

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
          {filteredUsers.length === 0 && <UserManagementEmpty isEmpty={true} />}
          
          {filteredUsers.length > 0 && (
            <div className="user-management__table">
              <UsersTable
                users={filteredUsers}
                loading={loading}
                config={tableConfig}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
