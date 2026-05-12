import React from 'react';
import type { TableConfig, User } from '@shared/types';

export function createUserManagementConfig(
  options: {
    currentUserId?: string;
    onBan?: (userId: string) => void;
    onUnban?: (userId: string) => void;
    onGrantAdmin?: (userId: string) => void;
    onRevokeAdmin?: (userId: string) => void;
  } = {}
): TableConfig<User> {
  return {
    columns: [
      {
        key: 'nickname',
        label: 'Nickname',
        render: (u) => u.nickname,
      },
      {
        key: 'email',
        label: 'Email',
        render: (u) => u.email || '-',
      },
      {
        key: 'role',
        label: 'Role',
        render: (u) => React.createElement('span', {
          style: {
            display: 'inline-block',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: u.role === 'ADMIN' ? '#ff6b6b' : '#228be6',
            color: 'white',
          },
        }, u.role),
      },
      {
        key: 'status',
        label: 'Status',
        render: (u) => React.createElement('span', {
          style: { color: u.bannedAt ? '#ff6b6b' : '#37b24d' },
        }, u.bannedAt ? 'Banned' : 'Active'),
      },
    ],
    actions: [
      {
        key: 'ban',
        label: 'Ban',
        title: 'Ban user',
        className: 'users-table__action--ban',
        onClick: (u) => options.onBan?.(u.id),
        isVisible: (u) => !u.bannedAt && u.id !== options.currentUserId ? true : false,
      },
      {
        key: 'unban',
        label: 'Unban',
        title: 'Unban user',
        className: 'users-table__action--unban',
        onClick: (u) => options.onUnban?.(u.id),
        isVisible: (u) => u.bannedAt && u.id !== options.currentUserId ? true : false,
      },
      {
        key: 'grant-admin',
        label: 'Grant Admin',
        title: 'Grant admin role',
        className: 'users-table__action--admin',
        onClick: (u) => options.onGrantAdmin?.(u.id),
        isVisible: (u) => u.role !== 'ADMIN' && u.id !== options.currentUserId ? true : false,
      },
      {
        key: 'revoke-admin',
        label: 'Revoke Admin',
        title: 'Revoke admin role',
        className: 'users-table__action--revoke',
        onClick: (u) => options.onRevokeAdmin?.(u.id),
        isVisible: (u) => u.role === 'ADMIN' && u.id !== options.currentUserId ? true : false,
      },
    ],
    enableHover: true,
    emptyMessage: 'No users found',
    maxHeight: 600,
    rowHeight: 46,
  };
}


export function createMessageAppTableConfig(
  options: {
    onRowClick?: (user: User) => void;
    onDelete?: (userId: string) => void;
    enableDragDrop?: boolean;
  } = {}
): TableConfig<User> {
  return {
    columns: [
      {
        key: 'nickname',
        label: 'Nickname',
        render: (u) => u.nickname,
      },
      {
        key: 'email',
        label: 'Email',
        render: (u) => u.email || '-',
      },
      {
        key: 'role',
        label: 'Role',
        render: (u) => React.createElement('span', {
          style: {
            display: 'inline-block',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: u.role === 'ADMIN' ? '#ff6b6b' : '#228be6',
            color: 'white',
          },
        }, u.role),
      },
    ],
    actions: [
      {
        key: 'view',
        label: '👁️',
        title: 'View details',
        onClick: (u) => options.onRowClick?.(u),
      },
      {
        key: 'delete',
        label: '🗑️',
        title: 'Delete user',
        onClick: (u) => options.onDelete?.(u.id),
      },
    ],
    enableDragDrop: options.enableDragDrop ?? false,
    enableRowClick: !!options.onRowClick,
    emptyMessage: 'No users found',
    maxHeight: 600,
    rowHeight: 46,
  };
}
