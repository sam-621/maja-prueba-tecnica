import { Separator } from '@/shared/components/ui/separator';
import type { Blog } from '@/lib/api/types';

import { CommentPrompt } from './comment-prompt';
import { CommentsList } from './comments-list';

type Props = {
  blog: Blog;
};

export const CommentsSection = ({ blog }: Props) => {
  return (
    <section className="flex flex-col gap-5">
      <Separator />

      <h2 className="text-xl font-semibold">Comentarios</h2>

      <CommentPrompt blog={blog} />

      <CommentsList blogId={blog.id} />
    </section>
  );
};
