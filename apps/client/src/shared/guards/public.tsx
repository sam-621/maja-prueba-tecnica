import type { ReactNode } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import { PageLoader } from '@/shared/components/loader/page-loader';
import { useUser } from '@/shared/contexts/user-context';

type Props = {
  children: ReactNode;
};

export const Public = ({ children }: Props) => {
  const { isLoading, isSignedIn } = useUser();
  const [searchParams] = useSearchParams();

  if (isLoading) return <PageLoader className="h-screen" />;

  if (isSignedIn) {
    const redirect = searchParams.get('redirect');
    return (
      <Navigate to={redirect ? decodeURIComponent(redirect) : '/'} replace />
    );
  }

  return <>{children}</>;
};
