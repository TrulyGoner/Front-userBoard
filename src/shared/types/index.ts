export interface User {
  id: string;
  nickname: string;
  email?: string;
  role: 'USER' | 'ADMIN';
  bannedAt?: string | null;
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

export type Nullable<T> = T | null;

export interface TableColumn<T = User> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  width?: string | number;
}

export interface TableAction<T = User> {
  key: string;
  label: string | React.ReactNode;
  onClick: (item: T) => void;
  className?: string;
  title?: string;
  isVisible?: (item: T) => boolean;
}

export interface TableConfig<T = User> {
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  maxHeight?: number;
  rowHeight?: number;
  emptyMessage?: string;
  enableHover?: boolean;
  enableDragDrop?: boolean;
  enableRowClick?: boolean;
}
