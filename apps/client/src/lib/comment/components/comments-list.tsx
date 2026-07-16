import { LoadMoreButton } from '@/lib/blog/components/load-more-button';

import { useComments } from '../hooks/use-comments';
import { CommentItem } from './comment-item';
import { CommentSkeleton } from './comment-skeleton';

type Props = {
  blogId: string;
};

export const CommentsList = ({ blogId }: Props) => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(blogId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <CommentSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        No se pudieron cargar los comentarios.
      </p>
    );
  }

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  if (!comments.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Todavía no hay comentarios. Sé el primero en comentar.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} blogId={blogId} />
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
