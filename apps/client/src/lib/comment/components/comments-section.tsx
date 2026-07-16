import { Separator } from '@/components/ui/separator';
import { useUser } from '@/shared/contexts/user-context';

import { CommentForm } from './comment-form';
import { CommentsList } from './comments-list';

type Props = {
  blogId: string;
};

export const CommentsSection = ({ blogId }: Props) => {
  const { isSignedIn } = useUser();

  return (
    <section className="flex flex-col gap-5">
      <Separator />

      <h2 className="text-xl font-semibold">Comentarios</h2>

      {isSignedIn ? (
        <CommentForm blogId={blogId} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Inicia sesión para dejar un comentario.
        </p>
      )}

      <CommentsList blogId={blogId} />
    </section>
  );
};
