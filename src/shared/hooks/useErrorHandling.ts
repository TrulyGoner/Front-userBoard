import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@store';
import { clearError as authClearError } from '@store/slices/authSlice';
import { clearError as tasksClearError } from '@store/slices/tasksSlice';

interface UseErrorHandlingReturn {
  error: string | null;
  clearError: () => void;
}


export const useErrorHandling = (domain: 'auth' | 'tasks'): UseErrorHandlingReturn => {
  const dispatch = useDispatch();
  const error = useSelector((state: RootState) => {
    if (domain === 'auth') return state.auth.error;
    if (domain === 'tasks') return state.tasks.error;
    return null;
  });

  const clearError = () => {
    if (domain === 'auth') {
      dispatch(authClearError());
    } else if (domain === 'tasks') {
      dispatch(tasksClearError());
    }
  };

  return { error, clearError };
};
