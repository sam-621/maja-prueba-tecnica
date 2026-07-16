import type { Post } from '@/persistence/entities';

export const DefaultPostFixture = (): Partial<Post> => ({
  id: crypto.randomUUID(),
  title: 'Test Post',
  content: 'Test post content',
  status: 'draft',
  authorId: crypto.randomUUID()
});
