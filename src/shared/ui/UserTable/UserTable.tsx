import { memo, useState, useMemo } from 'react';
import { List, type RowComponentProps } from 'react-window';
import { MAX_HEIGHT, ROW_HEIGHT, SKELETON_COUNT, SKELETON_KEYS } from '../../constants/UserTable';
import type { TableConfig, User, Nullable } from '@shared/types';
import { SkeletonRow } from '../Skeleton';
import './UserTable.css';

interface UserRowData {
  users: User[];
  config: TableConfig<User>;
  onRowClick?: (user: User) => void;
  onAction?: (actionKey: string, user: User) => void;
  dragIndex: Nullable<number>;
  overIndex: Nullable<number>;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
}

interface UserTableProps {
  users: User[];
  loading?: boolean;
  config?: TableConfig<User>;
  onReorder?: (from: number, to: number) => void;
}

const DEFAULT_CONFIG: TableConfig<User> = {
  columns: [
    { key: 'nickname', label: 'Nickname', render: (u) => u.nickname },
    { key: 'email', label: 'Email', render: (u) => u.email || '-' },
    { key: 'role', label: 'Role', render: (u) => u.role },
  ],
  enableDragDrop: false,
  enableRowClick: false,
  maxHeight: MAX_HEIGHT,
  rowHeight: ROW_HEIGHT,
  emptyMessage: 'No users found',
};

function RowComponent({ 
  index, 
  style, 
  users, 
  config, 
  onRowClick, 
  onAction,
  dragIndex, 
  overIndex, 
  onDragStart, 
  onDragOver, 
  onDrop, 
  onDragEnd 
}: RowComponentProps<UserRowData>) {
  const user = users[index];
  const isDragging = dragIndex === index;
  const isOver = overIndex === index && dragIndex !== index;

  const handleRowClick = (e: React.MouseEvent) => {
    if (!config.enableRowClick || !onRowClick) return;
    e.stopPropagation();
    onRowClick(user);
  };

  const handleAction = (actionKey: string) => {
    onAction?.(actionKey, user);
  };

  return (
    <div
      style={style}
      className={`ut-row${isDragging ? ' ut-row--dragging' : ''}${isOver ? ' ut-row--drag-over' : ''}`}
      draggable={config.enableDragDrop ?? false}
      onDragStart={() => config.enableDragDrop && onDragStart(index)}
      onDragOver={(e) => { e.preventDefault(); config.enableDragDrop && onDragOver(index); }}
      onDrop={() => config.enableDragDrop && onDrop(index)}
      onDragEnd={onDragEnd}
      onClick={handleRowClick}
    >
      {config.columns.map((column: typeof config.columns[number]) => (
        <div key={column.key} className={`ut-cell ${column.className || ''}`}>
          {column.render ? column.render(user) : ''}
        </div>
      ))}

      {config.actions && config.actions.length > 0 && (
        <div className="ut-cell ut-cell--actions">
          {config.actions.map((action: typeof config.actions[number]) => {
            const isVisible = action.isVisible ? action.isVisible(user) : true;
            if (!isVisible) return null;

            return (
              <button
                key={action.key}
                className={`ut-action ${action.className || ''}`}
                title={action.title}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(action.key);
                }}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const Row = memo(RowComponent) as typeof RowComponent;

export function UserTable({ 
  users, 
  loading, 
  config: userConfig,
  onReorder 
}: UserTableProps) {
  const [dragIndex, setDragIndex] = useState<Nullable<number>>(null);
  const [overIndex, setOverIndex] = useState<Nullable<number>>(null);

  const config = useMemo(() => ({ ...DEFAULT_CONFIG, ...userConfig }), [userConfig]);

  function handleDragStart(index: number) { setDragIndex(index); }
  function handleDragOver(index: number) { setOverIndex(index); }
  function handleDrop(index: number) {
    if (dragIndex !== null && dragIndex !== index && onReorder) {
      onReorder(dragIndex, index);
    }
    setDragIndex(null);
    setOverIndex(null);
  }
  function handleDragEnd() { setDragIndex(null); setOverIndex(null); }

  function handleAction(actionKey: string, user: User) {
    const action = config.actions?.find(a => a.key === actionKey);
    if (action) {
      action.onClick(user);
    }
  }

  if (users.length === 0 && !loading) {
    return <p className="ut-empty">{config.emptyMessage}</p>;
  }

  const listHeight = Math.min(users.length * (config.rowHeight || ROW_HEIGHT), config.maxHeight || MAX_HEIGHT);
  const skeletonCount = users.length === 0 ? SKELETON_COUNT : 1;
  const listContainerStyle = { height: listHeight } as const;
  const listStyle = { overflow: listHeight < (config.maxHeight || MAX_HEIGHT) ? 'hidden' : 'auto' } as const;
  const rowProps = { 
    users, 
    config,
    onRowClick: config.enableRowClick ? (() => {}) : undefined,
    onAction: handleAction,
    dragIndex, 
    overIndex, 
    onDragStart: handleDragStart, 
    onDragOver: handleDragOver, 
    onDrop: handleDrop, 
    onDragEnd: handleDragEnd 
  };

  const hasActions = config.actions && config.actions.length > 0;

  return (
    <div className="ut-container">
      <div className="ut-header-row">
        {config.columns.map((column) => (
          <div key={column.key} className="ut-th">
            {column.label}
          </div>
        ))}
        {hasActions && <div className="ut-th" aria-label="Actions" />}
      </div>
      {users.length > 0 && (
        <div style={listContainerStyle}>
          <List
            rowComponent={Row}
            rowCount={users.length}
            rowHeight={config.rowHeight || ROW_HEIGHT}
            rowProps={rowProps}
            defaultHeight={listHeight}
            style={listStyle}
          />
        </div>
      )}
      {loading && SKELETON_KEYS.slice(0, skeletonCount).map(key => <SkeletonRow key={key} />)}
    </div>
  );
}
