import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import type { RootState, AppDispatch } from '@store';
import { login } from '@store/slices/authSlice';
import { Button, Input, ErrorAlert } from '@shared/ui';
import { useErrorHandling } from '@shared/hooks';
import './AuthForms.scss';

interface LoginForm {
  nickname: string;
  password: string;
}

export const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const { error, clearError } = useErrorHandling('auth');
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    dispatch(login(data));
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        {error && <ErrorAlert error={error} onClear={clearError} />}
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form__form">
          <Input
            label="Nickname"
            type="text"
            placeholder="Enter your nickname"
            error={errors.nickname?.message}
            {...register('nickname', { required: 'Nickname is required' })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />
          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};
