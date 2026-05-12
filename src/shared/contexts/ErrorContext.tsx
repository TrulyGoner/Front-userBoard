import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { ErrorAlert } from '@shared/ui';
import type { AxiosError } from 'axios';

interface ErrorContextType {
  emitError: (error: unknown) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emitError = (err: unknown) => {
    let message = 'An error occurred';

    if (err instanceof Error) {
      if ('response' in err && (err as AxiosError).response?.data) {
        const data = (err as AxiosError).response?.data as { message?: string };
        message = data.message || err.message;
      } else {
        message = err.message;
      }
    } else if (typeof err === 'string') {
      message = err;
    } else if (err && typeof err === 'object' && 'message' in err) {
      message = String((err as { message: unknown }).message);
    } else {
      message = String(err);
    }

    setError(message);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setError(null);
      timeoutRef.current = null;
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ErrorContext.Provider value={{ emitError }}>
      {error && <ErrorAlert error={error} onClear={() => setError(null)} />}
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within ErrorProvider');
  }
  return context;
};
