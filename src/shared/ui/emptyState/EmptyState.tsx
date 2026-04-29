import './EmptyState.scss';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({
  title = 'Nothing here yet',
  description = 'No items to display',
  icon,
}: EmptyStateProps) => {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
    </div>
  );
};
