import { ArrowLeft } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';

import { ButtonLink } from '@/shared/components/ui/button-link';
import { PageLoader } from '@/shared/components/loader/page-loader';
import { useUser } from '@/shared/contexts/user-context';
import { BlogForm } from '@/lib/blog/components/blog-form/blog-form';
import { useBlog } from '@/lib/blog/hooks/use-blog';

export const EditBlogPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isLoading: isUserLoading } = useUser();
  const { data: blog, isLoading, error } = useBlog(slug);

  if (isLoading || isUserLoading) return <PageLoader />;

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

  if (user?.id !== blog.authorId) {
    return <Navigate to={`/blogs/${blog.slug}`} replace />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <ButtonLink
          to={`/blogs/${blog.slug}`}
          variant="ghost"
          size="sm"
          className="self-start"
        >
          <ArrowLeft />
          Volver
        </ButtonLink>
        <h1 className="text-2xl font-semibold">Editar publicación</h1>
      </div>

      <BlogForm blog={blog} />
    </div>
  );
};
