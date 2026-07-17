import { ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/shared/utils/format-date';
import { MarkdownPreview } from '@/shared/components/markdown/markdown-preview';
import { ButtonLink } from '@/shared/components/ui/button-link';
import { PageLoader } from '@/shared/components/loader/page-loader';
import { BlogActions } from '@/lib/blog/components/blog-actions/blog-actions';
import { CommentsSection } from '@/lib/comment/components/comments-section';
import { useBlog } from '@/lib/blog/hooks/use-blog';
import { getStatusLabel } from '@/lib/blog/constants/status-labels';
import { useUser } from '@/shared/contexts/user-context';

export const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading, error } = useBlog(slug);
  const { user } = useUser();

  if (isLoading) return <PageLoader />;

  if (error || !blog) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted-foreground">
          Esta publicación no está disponible.
        </p>
        <ButtonLink to="/" variant="outline">
          <ArrowLeft />
          Volver al feed
        </ButtonLink>
      </div>
    );
  }

  return (
    <article className="flex flex-col gap-6">
      <ButtonLink to="/" variant="ghost" size="sm" className="self-start">
        <ArrowLeft />
        Volver
      </ButtonLink>

      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">{blog.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {blog.author && (
              <>
                <span>por {blog.author.fullname}</span>
                <span aria-hidden>·</span>
              </>
            )}
            <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
            {user?.id === blog.authorId && (
              <Badge variant="outline">{getStatusLabel(blog.status)}</Badge>
            )}
          </div>
        </div>

        <BlogActions blog={blog} />
      </header>

      <MarkdownPreview content={blog.content} />

      <CommentsSection blog={blog} />
    </article>
  );
};
