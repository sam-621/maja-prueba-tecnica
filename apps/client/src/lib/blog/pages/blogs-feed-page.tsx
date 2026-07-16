import { PenLine } from 'lucide-react';

import { ButtonLink } from '@/shared/components/ui/button-link';
import { useUser } from '@/shared/contexts/user-context';
import { BlogsList } from '@/lib/blog/components/blogs-list';
import { BlogsSearch } from '@/lib/blog/components/blogs-search';
import { BlogFeedProvider } from '@/lib/blog/contexts/blog-feed-context';

export const BlogsFeedPage = () => {
  const { isSignedIn } = useUser();

  return (
    <BlogFeedProvider>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Latest posts</h1>
            <p className="text-sm text-muted-foreground">
              Read what the community is publishing.
            </p>
          </div>
          {isSignedIn && (
            <ButtonLink to="/new">
              <PenLine />
              Write a post
            </ButtonLink>
          )}
        </div>

        <BlogsSearch />

        <BlogsList />
      </div>
    </BlogFeedProvider>
  );
};
