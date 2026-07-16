import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { PageLoader } from '@/shared/components/loader/page-loader';
import { useUser } from '@/shared/contexts/user-context';

type Props = {
  children: ReactNode;
};

export const Protect = ({ children }: Props) => {
  const { isLoading, isSignedIn } = useUser();
  const location = useLocation();

  if (isLoading) return <PageLoader className="h-screen" />;

  if (!isSignedIn) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <>{children}</>;
};
