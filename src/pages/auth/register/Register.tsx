import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import type { RootState, AppDispatch } from '@store';
import { register as registerUser } from '@store/slices/authSlice';
import { Button, Input, ErrorAlert } from '@shared/ui';
import { useErrorHandling } from '@shared/hooks';
import './Register.scss';

interface RegisterForm {
  nickname: string;
  password: string;
  email?: string;
}

export const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const { error, clearError } = useErrorHandling('auth');
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();

  const onSubmit = (data: RegisterForm) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Register</h2>
        {error && <ErrorAlert error={error} onClear={clearError} />}
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form__form">
          <Input
            label="Nickname"
            type="text"
            placeholder="Choose a nickname"
            error={errors.nickname?.message}
            {...register('nickname', {
              required: 'Nickname is required',
              minLength: { value: 3, message: 'Nickname must be at least 3 characters' },
              maxLength: { value: 24, message: 'Nickname must be at most 24 characters' },
              pattern: { value: /^[a-z0-9_]+$/, message: 'Nickname can only contain lowercase letters, numbers, and underscores' }
            })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' }
            })}
          />
          <Input
            label="Email (optional)"
            type="email"
            placeholder="your@email.com"
            {...register('email')}
          />
          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </div>
    </div>
  );
};
