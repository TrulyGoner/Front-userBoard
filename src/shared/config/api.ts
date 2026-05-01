export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PASSWORD_CHANGE: '/auth/password',
  },
  TASKS: {
    LIST: '/tasks',
    DETAIL: (id: string) => `/tasks/${id}`,
    CREATE: '/tasks',
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
    ASSIGN: (id: string) => `/tasks/${id}/assignment`,
    APPROVE_ASSIGNMENT: (id: string) => `/tasks/${id}/assignment/approve`,
    REJECT_ASSIGNMENT: (id: string) => `/tasks/${id}/assignment/reject`,
    ADD_TAG: (id: string) => `/tasks/${id}/tags`,
    REMOVE_TAG: (id: string, tagId: string) => `/tasks/${id}/tags/${tagId}`,
  },
  USERS: {
    LIST: '/users',
  },
  ADMIN: {
    USERS_LIST: '/admin/users',
    BAN_USER: (userId: string) => `/admin/users/${userId}/ban`,
    UNBAN_USER: (userId: string) => `/admin/users/${userId}/unban`,
    LIST_BLOCKS: '/admin/blocks',
    REMOVE_BLOCK: '/admin/blocks',
  },
} as const;
