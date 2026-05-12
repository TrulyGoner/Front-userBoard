import React from 'react';

interface UserManagementLoadingProps {
  isLoading: boolean;
}

export const UserManagementLoading: React.FC<UserManagementLoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return <div className="user-management__loading">Loading...</div>;
};
