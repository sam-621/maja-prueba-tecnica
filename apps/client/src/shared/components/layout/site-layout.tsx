import { PenLine } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

import { useUser } from '@/shared/contexts/user-context';
import { ButtonLink } from '@/shared/components/ui/button-link';

import { UserMenu } from './user-menu';

export const SiteLayout = () => {
  const { isSignedIn } = useUser();

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <PenLine className="size-4" />
            Blog
          </Link>

          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <UserMenu />
            ) : (
              <>
                <ButtonLink to="/login" variant="ghost" size="sm">
                  Log in
                </ButtonLink>
                <ButtonLink to="/signup" size="sm">
                  Sign up
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};
