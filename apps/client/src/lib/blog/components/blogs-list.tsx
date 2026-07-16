import { EmptyState } from '@/shared/components/empty-state';
import { PageLoader } from '@/shared/components/loader/page-loader';

import { useBlogFeed } from '../contexts/blog-feed-context';
import { useBlogs } from '../hooks/use-blogs';
import { BlogCard } from './blog-card';
import { LoadMoreButton } from './load-more-button';

export const BlogsList = () => {
  const { debouncedSearch } = useBlogFeed();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBlogs({ search: debouncedSearch });

  const blogs = data?.pages.flatMap((page) => page.blogs) ?? [];

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar las publicaciones"
        subtitle="El feed del blog no está disponible en este momento."
      />
    );
  }

  if (!blogs.length) {
    return (
      <EmptyState
        title="Aún no hay publicaciones"
        subtitle={
          debouncedSearch
            ? 'Ninguna publicación coincide con tu búsqueda.'
            : 'Sé el primero en publicar algo.'
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
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
