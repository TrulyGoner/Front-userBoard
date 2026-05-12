import { useEffect, useState } from 'react';
import type {ReactNode} from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '@store';
import { ErrorAlert } from '@shared/ui';
import './ErrorBoundary.scss';

interface ErrorBoundaryProps {
  children: ReactNode;
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const tasksError = useSelector((state: RootState) => state.tasks.error);
  const authError = useSelector((state: RootState) => state.auth.error);

  useEffect(() => {
    if (tasksError || authError) {
      setHasError(true);
      setErrorMessage(tasksError || authError || 'An error occurred');
    }
  }, [tasksError, authError]);

  const handleClearError = () => {
    setHasError(false);
    setErrorMessage(null);
  };

  if (hasError && errorMessage) {
    return (
      <div className="error-boundary">
        <div className="error-boundary__content">
          <ErrorAlert error={errorMessage} onClear={handleClearError} />
          <button 
            className="error-boundary__retry-button"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
