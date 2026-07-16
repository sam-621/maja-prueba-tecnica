import { AuthLayout } from '../components/auth-layout';
import { SignupForm } from '../components/signup-form/signup-form';

export const SignupPage = () => {
  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a escribir en segundos."
    >
      <SignupForm />
    </AuthLayout>
  );
};
