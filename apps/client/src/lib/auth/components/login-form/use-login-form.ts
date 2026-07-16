import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { useLogin } from '../../hooks/use-login';

const schema = z.object({
  email: z.email('Introduce un correo válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export type LoginFormInput = z.infer<typeof schema>;

export const useLoginForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading } = useLogin();

  const form = useForm<LoginFormInput>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const result = await login(data);

    if (!result.isSuccess) {
      toast.error(result.error);
      return;
    }

    const redirect = searchParams.get('redirect');
    navigate(redirect ? decodeURIComponent(redirect) : '/', { replace: true });
  });

  return { form, onSubmit, isLoading };
};
