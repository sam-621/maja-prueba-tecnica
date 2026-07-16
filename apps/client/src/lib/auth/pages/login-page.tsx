import { LoginForm } from '../components/login-form/login-form';
import { AuthLayout } from '../components/auth-layout';

export const LoginPage = () => {
  return (
    <AuthLayout title="Welcome back" subtitle="Log in to manage your blog.">
      <LoginForm />
    </AuthLayout>
  );
};
