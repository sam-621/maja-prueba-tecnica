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
        <FieldLabel htmlFor="fullname">Full name</FieldLabel>
        <Input
          id="fullname"
          placeholder="Jane Doe"
          autoComplete="name"
          aria-invalid={!!errors.fullname}
          {...register('fullname')}
        />
        {errors.fullname && <FieldError>{errors.fullname.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && <FieldError>{errors.email.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && <FieldError>{errors.password.message}</FieldError>}
      </Field>

      <Button type="submit" size="lg" disabled={isLoading} className="mt-1">
        {isLoading && <Loader2 className="animate-spin" />}
        Create account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-foreground hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
};
