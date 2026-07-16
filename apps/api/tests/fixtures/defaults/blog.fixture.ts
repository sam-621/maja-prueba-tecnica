import type { Blog } from '@/persistence/entities';

export const DefaultBlogFixture = (): Partial<Blog> => ({
  id: crypto.randomUUID(),
  title: 'Test Post',
  content: 'Test post content',
  status: 'draft',
  authorId: crypto.randomUUID()
});
