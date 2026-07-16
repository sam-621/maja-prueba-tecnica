import { ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { ButtonLink } from '@/shared/components/ui/button-link';
import { PageLoader } from '@/shared/components/loader/page-loader';
import { BlogForm } from '@/lib/blog/components/blog-form/blog-form';
import { useBlog } from '@/lib/blog/hooks/use-blog';

export const EditBlogPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: blog, isLoading, error } = useBlog(id);

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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <ButtonLink
          to={`/blogs/${blog.id}`}
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
