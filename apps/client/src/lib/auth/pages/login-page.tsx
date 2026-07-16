import { LoginForm } from '../components/login-form/login-form';
import { AuthLayout } from '../components/auth-layout';

export const LoginPage = () => {
  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para gestionar tu blog."
    >
      <LoginForm />
    </AuthLayout>
  );
};
