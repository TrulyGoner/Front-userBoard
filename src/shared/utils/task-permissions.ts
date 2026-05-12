import type { Task, User } from '@shared/types';


export const canEditTask = (task: Task | null, user: User | null): boolean => {
  if (!task || !user) return false;

  const isCreator = task.creatorId === user.id;
  const isAssignee = task.assigneeId === user.id;
  const isAdmin = user.role === 'ADMIN';

  return isCreator || isAssignee || isAdmin;
};


export const canDeleteTask = (task: Task | null, user: User | null): boolean => {
  if (!task || !user) return false;

  const isCreator = task.creatorId === user.id;
  const isAdmin = user.role === 'ADMIN';

  return isCreator || isAdmin;
};


export const canMoveTask = (task: Task | null, user: User | null): boolean => {
  if (!task || !user) return false;

  const isCreator = task.creatorId === user.id;
  const isAssignee = task.assigneeId === user.id;
  const isAdmin = user.role === 'ADMIN';

  return isCreator || isAssignee || isAdmin;
};
