import { EmptyState } from '@/shared/components/empty-state';
import { PageLoader } from '@/shared/components/loader/page-loader';
import { BlogCard } from '@/lib/blog/components/blog-card';
import { LoadMoreButton } from '@/lib/blog/components/load-more-button';
import { useBlogFeed } from '@/lib/blog/contexts/blog-feed-context';

import { useProfileBlogs } from '../hooks/use-profile-blogs';

export const ProfileBlogsList = () => {
  const { debouncedSearch, categoryIds, hasActiveFilters } = useBlogFeed();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProfileBlogs({
    search: debouncedSearch,
    categoryIds,
  });

  const blogs = data?.pages.flatMap((page) => page.blogs) ?? [];

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar tus publicaciones"
        subtitle="Tus publicaciones no están disponibles en este momento."
      />
    );
  }

  if (!blogs.length) {
    return (
      <EmptyState
        title="Aún no hay publicaciones"
        subtitle={
          hasActiveFilters
            ? 'Ninguna publicación coincide con los filtros.'
            : 'Aún no has escrito nada.'
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
