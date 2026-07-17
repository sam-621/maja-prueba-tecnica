import type { Blog } from '@/lib/api/types';
import { useUser } from '@/shared/contexts/user-context';

import { CommentForm } from './comment-form';

type Props = {
  blog: Blog;
};

export const CommentPrompt = ({ blog }: Props) => {
  const { isSignedIn } = useUser();

  if (blog.status !== 'published') {
    return (
      <p className="text-sm text-muted-foreground">
        Los comentarios estarán disponibles cuando publiques esta entrada.
      </p>
    );
  }

  if (!isSignedIn) {
    return (
      <p className="text-sm text-muted-foreground">
        Inicia sesión para dejar un comentario.
      </p>
    );
  }

  return <CommentForm blogId={blog.id} />;
};
