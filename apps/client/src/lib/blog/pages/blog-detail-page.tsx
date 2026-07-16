import { ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/shared/components/ui/button-link';
import { PageLoader } from '@/shared/components/loader/page-loader';
import { useBlog } from '@/lib/blog/hooks/use-blog';

export const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: blog, isLoading, error } = useBlog(id);

  if (isLoading) return <PageLoader />;

  if (error || !blog) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted-foreground">This post is not available.</p>
        <ButtonLink to="/" variant="outline">
          <ArrowLeft />
          Back to feed
        </ButtonLink>
      </div>
    );
  }

  return (
    <article className="flex flex-col gap-6">
      <ButtonLink to="/" variant="ghost" size="sm" className="self-start">
        <ArrowLeft />
        Back
      </ButtonLink>

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">{blog.title}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {blog.author && <span>by {blog.author.fullname}</span>}
          <Badge variant="outline">{blog.status}</Badge>
        </div>
      </header>

      <div className="leading-relaxed whitespace-pre-wrap text-foreground/90">
        {blog.content}
      </div>
    </article>
  );
};
