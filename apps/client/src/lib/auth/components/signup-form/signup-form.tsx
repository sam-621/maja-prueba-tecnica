import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { useSignupForm } from './use-signup-form';

export const SignupForm = () => {
  const { form, onSubmit, isLoading } = useSignupForm();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <Field>
        <FieldLabel htmlFor="fullname">Nombre completo</FieldLabel>
        <Input
          id="fullname"
          placeholder="Juan Pérez"
          autoComplete="name"
          aria-invalid={!!errors.fullname}
          {...register('fullname')}
        />
        {errors.fullname && <FieldError>{errors.fullname.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="tu@ejemplo.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && <FieldError>{errors.email.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Contraseña</FieldLabel>
        <Input
          id="password"
          type="password"
          placeholder="Al menos 8 caracteres"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && <FieldError>{errors.password.message}</FieldError>}
      </Field>

      <Button type="submit" size="lg" disabled={isLoading} className="mt-1">
        {isLoading && <Loader2 className="animate-spin" />}
        Crear cuenta
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{' '}
        <Link
          to="/login"
          className="font-medium text-foreground hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
};
