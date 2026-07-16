import { PenLine } from 'lucide-react';

import { ButtonLink } from '@/shared/components/ui/button-link';
import { useUser } from '@/shared/contexts/user-context';
import { BlogsList } from '@/lib/blog/components/blogs-list';
import { BlogsSearch } from '@/lib/blog/components/blogs-search';
import { BlogsCategoryFilter } from '@/lib/blog/components/blogs-category-filter';
import { BlogFeedProvider } from '@/lib/blog/contexts/blog-feed-context';

export const BlogsFeedPage = () => {
  const { isSignedIn } = useUser();

  return (
    <BlogFeedProvider>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Últimas publicaciones</h1>
            <p className="text-sm text-muted-foreground">
              Lee lo que la comunidad está publicando.
            </p>
          </div>
          {isSignedIn && (
            <ButtonLink to="/new">
              <PenLine />
              Escribir
            </ButtonLink>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <BlogsSearch />
          </div>
          <div className="sm:w-72">
            <BlogsCategoryFilter />
          </div>
        </div>

        <BlogsList />
      </div>
    </BlogFeedProvider>
  );
};
