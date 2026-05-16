import type { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@store';
import { ErrorAlert, Button } from '@shared/ui';
import { clearError as clearTasksError } from '@store/slices/tasksSlice';
import { clearError as clearAuthError } from '@store/slices/authSlice';
import './ErrorBoundary.scss';

interface ErrorBoundaryProps {
  children: ReactNode;
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  const dispatch = useDispatch();
  const tasksError = useSelector((state: RootState) => state.tasks.error);
  const authError = useSelector((state: RootState) => state.auth.error);

  const errorMessage = tasksError || authError || null;
  const hasError = Boolean(errorMessage);

  const handleClearError = () => {
    dispatch(clearTasksError());
    dispatch(clearAuthError());
  };

  if (hasError && errorMessage) {
    return (
      <div className="error-boundary">
        <div className="error-boundary__content">
          <ErrorAlert error={errorMessage} onClear={handleClearError} />
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};