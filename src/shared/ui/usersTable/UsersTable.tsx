import type { User, TableConfig } from '@shared/types';
import './UsersTable.scss';

interface UsersTableProps {
  users: User[];
  loading?: boolean;
  config: TableConfig<User>;
  onAction?: (actionKey: string, user: User) => void;
}

export function UsersTable({ users, loading, config, onAction }: UsersTableProps) {
  if (users.length === 0 && !loading) {
    return <div className="users-table__empty">{config.emptyMessage || 'No users found'}</div>;
  }

  return (
    <div className="users-table">
      <div className="users-table__wrapper">
        <table className="users-table__table">
          <thead>
            <tr className="users-table__header-row">
              {config.columns.map((column) => (
                <th key={column.key} className={`users-table__header-cell ${column.className || ''}`}>
                  {column.label}
                </th>
              ))}
              {config.actions && config.actions.length > 0 && (
                <th className="users-table__header-cell users-table__header-cell--actions">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={`users-table__row ${user.bannedAt ? 'users-table__row--banned' : ''}`}
              >
                {config.columns.map((column) => (
                  <td
                    key={column.key}
                    className={`users-table__cell ${column.className || ''}`}
                  >
                    {column.render ? column.render(user) : ''}
                  </td>
                ))}
                {config.actions && config.actions.length > 0 && (
                  <td className="users-table__cell users-table__cell--actions">
                    {config.actions.map((action) => {
                      const isVisible = action.isVisible ? action.isVisible(user) : true;
                      if (!isVisible) return null;

                      return (
                        <button
                          key={action.key}
                          className={`users-table__action ${action.className || ''}`}
                          title={action.title}
                          onClick={() => {
                            action.onClick(user);
                            onAction?.(action.key, user);
                          }}
                        >
                          {action.label}
                        </button>
                      );
                    })}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && <div className="users-table__loading">Loading...</div>}
    </div>
  );
}
