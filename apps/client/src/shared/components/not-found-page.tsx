import { ButtonLink } from '@/shared/components/ui/button-link';

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <ButtonLink to="/" variant="outline">
        Back to feed
      </ButtonLink>
    </div>
  );
};
