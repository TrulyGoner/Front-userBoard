import { describe, test, expect } from 'vitest';
import { canEditTask, canMoveTask, canDeleteTask } from '../task-permissions';
import type { Task, User } from '@shared/types';

describe('Task Permissions', () => {
  const mockUser: User = {
    id: '1',
    nickname: 'testuser',
    role: 'USER',
  };

  const mockAdminUser: User = {
    id: '2',
    nickname: 'admin',
    role: 'ADMIN',
  };

  const mockTask: Task = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test Description',
    creatorId: '1',
    assigneeId: '3',
    status: 'TODO',
    priority: 'MEDIUM',
    visibility: 'LIST',
    tags: [],
    createdAt: '2026-05-12T00:00:00Z',
    updatedAt: '2026-05-12T00:00:00Z',
  };

  const otherUserTask: Task = {
    ...mockTask,
    id: 'task-2',
    creatorId: '99',
    assigneeId: '98',
  };

  describe('canEditTask', () => {
    test('creator can edit their own task', () => {
      expect(canEditTask(mockTask, mockUser)).toBe(true);
    });

    test('assignee can edit assigned task', () => {
      const assignedTask = { ...mockTask, assigneeId: '1' };
      expect(canEditTask(assignedTask, mockUser)).toBe(true);
    });

    test('admin can edit any task', () => {
      expect(canEditTask(otherUserTask, mockAdminUser)).toBe(true);
    });

    test('other user cannot edit task', () => {
      const otherUser: User = { ...mockUser, id: '100' };
      expect(canEditTask(mockTask, otherUser)).toBe(false);
    });

    test('returns false if task is null', () => {
      expect(canEditTask(null, mockUser)).toBe(false);
    });

    test('returns false if user is null', () => {
      expect(canEditTask(mockTask, null)).toBe(false);
    });
  });

  describe('canDeleteTask', () => {
    test('creator can delete their own task', () => {
      expect(canDeleteTask(mockTask, mockUser)).toBe(true);
    });

    test('admin can delete any task', () => {
      expect(canDeleteTask(otherUserTask, mockAdminUser)).toBe(true);
    });

    test('assignee cannot delete task', () => {
      const assignedTask = { ...mockTask, creatorId: '99', assigneeId: '1' };
      expect(canDeleteTask(assignedTask, mockUser)).toBe(false);
    });

    test('other user cannot delete task', () => {
      const otherUser: User = { ...mockUser, id: '100' };
      expect(canDeleteTask(mockTask, otherUser)).toBe(false);
    });

    test('returns false if task is null', () => {
      expect(canDeleteTask(null, mockUser)).toBe(false);
    });

    test('returns false if user is null', () => {
      expect(canDeleteTask(mockTask, null)).toBe(false);
    });
  });

  describe('canMoveTask', () => {
    test('creator can move their own task', () => {
      expect(canMoveTask(mockTask, mockUser)).toBe(true);
    });

    test('assignee can move assigned task', () => {
      const assignedTask = { ...mockTask, assigneeId: '1' };
      expect(canMoveTask(assignedTask, mockUser)).toBe(true);
    });

    test('admin can move any task', () => {
      expect(canMoveTask(otherUserTask, mockAdminUser)).toBe(true);
    });

    test('other user cannot move task', () => {
      const otherUser: User = { ...mockUser, id: '100' };
      expect(canMoveTask(mockTask, otherUser)).toBe(false);
    });

    test('returns false if task is null', () => {
      expect(canMoveTask(null, mockUser)).toBe(false);
    });

    test('returns false if user is null', () => {
      expect(canMoveTask(mockTask, null)).toBe(false);
    });

    test('admin can move task even if not creator or assignee', () => {
      expect(canMoveTask(otherUserTask, mockAdminUser)).toBe(true);
    });
  });
});
