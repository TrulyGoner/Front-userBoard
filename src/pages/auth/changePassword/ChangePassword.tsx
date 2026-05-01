import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { authAPI } from '@shared/services';
import { Button, Input, ErrorAlert } from '@shared/ui';
import { useErrorHandling } from '@shared/hooks';
import './ChangePassword.scss';

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ErrorResponse {
  message: string;
}

interface ChangePasswordProps {
  onClose: () => void;
}

export const ChangePassword = ({ onClose }: ChangePasswordProps) => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<ChangePasswordFormData>();
  const { error, clearError } = useErrorHandling('auth');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: ChangePasswordFormData) => {
    clearError();
    
    if (data.newPassword !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    if (data.newPassword.length < 8) {
      setError('newPassword', {
        type: 'manual',
        message: 'Password must be at least 8 characters',
      });
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMsg = axiosError.response?.data?.message || 'Failed to change password';
      setError('currentPassword', {
        type: 'manual',
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password">
      <h2>Change Password</h2>
      
      {success && (
        <div className="change-password__success">
          Password changed successfully! Redirecting...
        </div>
      )}

      {error && <ErrorAlert error={error} onClear={clearError} />}

      <form onSubmit={handleSubmit(onSubmit)} className="change-password__form">
        <Input
          label="Current Password"
          type="password"
          placeholder="Enter your current password"
          error={errors.currentPassword?.message}
          {...register('currentPassword', { required: 'Current password is required' })}
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password (min 8 characters)"
          error={errors.newPassword?.message}
          {...register('newPassword', { 
            required: 'New password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' }
          })}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', { required: 'Please confirm your password' })}
        />

        <div className="change-password__actions">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
