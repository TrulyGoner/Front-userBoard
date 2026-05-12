import React from 'react';

interface UserManagementEmptyProps {
  isEmpty: boolean;
}

export const UserManagementEmpty: React.FC<UserManagementEmptyProps> = ({ isEmpty }) => {
  if (!isEmpty) return null;
  
  return <div className="user-management__empty">No users found</div>;
};
