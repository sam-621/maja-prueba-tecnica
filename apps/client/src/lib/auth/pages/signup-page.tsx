import { AuthLayout } from '../components/auth-layout';
import { SignupForm } from '../components/signup-form/signup-form';

export const SignupPage = () => {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start writing in seconds."
    >
      <SignupForm />
    </AuthLayout>
  );
};
