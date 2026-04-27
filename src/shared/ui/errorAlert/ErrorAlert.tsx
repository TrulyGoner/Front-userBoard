import type { ReactNode } from 'react';
import { Button } from '../button/Button';
import './ErrorAlert.scss';

interface ErrorAlertProps {
  error: string;
  onClear: () => void;
  children?: ReactNode;
}

export const ErrorAlert = ({ error, onClear }: ErrorAlertProps) => {
  if (!error) return null;

  return (
    <div className="error-alert">
      <p className="error-alert__text">{error}</p>
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={onClear}
        className="error-alert__button"
      >
        Clear
      </Button>
    </div>
  );
};
