import type { Comment } from '@/persistence/entities';

export const DefaultCommentFixture = (): Partial<Comment> => ({
  id: crypto.randomUUID(),
  content: 'Test comment',
  postId: crypto.randomUUID(),
  authorId: crypto.randomUUID()
});
