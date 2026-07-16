import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { useSignup } from '../../hooks/use-signup';

const schema = z.object({
  fullname: z.string().min(1, 'Your name is required'),
  email: z.email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignupFormInput = z.infer<typeof schema>;

export const useSignupForm = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useSignup();

  const form = useForm<SignupFormInput>({
    resolver: zodResolver(schema),
    defaultValues: { fullname: '', email: '', password: '' },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const result = await signup(data);

    if (!result.isSuccess) {
      toast.error(result.error);
      return;
    }

    navigate('/', { replace: true });
  });

  return { form, onSubmit, isLoading };
};
