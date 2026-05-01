export interface User {
  id: string;
  nickname: string;
  email?: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  visibility: 'ONLY_ME' | 'LIST' | 'ANYONE';
  creatorId: string;
  creator?: User;
  assigneeId?: string;
  assignee?: User;
  assignmentStatus?: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  assignedById?: string;
  assignedBy?: User;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
