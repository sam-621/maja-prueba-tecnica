import { EmptyState } from '@/shared/components/empty-state';
import { PageLoader } from '@/shared/components/loader/page-loader';

import { useBlogFeed } from '../contexts/blog-feed-context';
import { useBlogs } from '../hooks/use-blogs';
import { BlogCard } from './blog-card';

export const BlogsList = () => {
  const { debouncedSearch } = useBlogFeed();
  const { data, isLoading, error } = useBlogs({ search: debouncedSearch });

  const blogs = data?.blogs ?? [];

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <EmptyState
        title="Couldn't load posts"
        subtitle="The blog feed isn't available right now."
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
            : 'Be the first to publish something.'
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};
