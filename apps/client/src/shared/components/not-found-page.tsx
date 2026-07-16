import { ButtonLink } from '@/shared/components/ui/button-link';

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold">Página no encontrada</h1>
      <ButtonLink to="/" variant="outline">
        Volver al feed
      </ButtonLink>
    </div>
  );
};
