import { EmptyState } from '@/shared/components/empty-state';
import { PageLoader } from '@/shared/components/loader/page-loader';
import { BlogCard } from '@/lib/blog/components/blog-card';
import { LoadMoreButton } from '@/lib/blog/components/load-more-button';
import { useBlogFeed } from '@/lib/blog/contexts/blog-feed-context';

import { useProfileBlogs } from '../hooks/use-profile-blogs';

export const ProfileBlogsList = () => {
  const { debouncedSearch } = useBlogFeed();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProfileBlogs({
    search: debouncedSearch,
  });

  const blogs = data?.pages.flatMap((page) => page.blogs) ?? [];

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <EmptyState
        title="Couldn't load your posts"
        subtitle="Your posts aren't available right now."
      />
    );
  }

  if (!blogs.length) {
    return (
      <EmptyState
        title="No posts yet"
        subtitle={
          debouncedSearch
            ? 'No posts match your search.'
            : "You haven't written anything yet."
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} showStatus />
      ))}
      {hasNextPage && (
        <LoadMoreButton
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
        />
      )}
    </div>
  );
};
