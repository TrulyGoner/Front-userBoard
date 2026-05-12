import React from 'react';
import { SkeletonRow } from '@shared/ui';

interface UserManagementLoadingProps {
  isLoading: boolean;
}

export const UserManagementLoading: React.FC<UserManagementLoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="user-management__loading">
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonRow key={index} />
      ))}
    </div>
  );
};
