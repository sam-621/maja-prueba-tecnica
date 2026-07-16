import { Comment } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';

import { BlogConstants } from './blog.fixtures';
import { UserConstants } from './user.fixtures';

export const CommentConstants = {
  COUNT: 3
};

export class CommentFixtures implements Fixture<Comment> {
  entity = Comment;

  async build(): Promise<Partial<Comment>[]> {
    return Array.from({ length: CommentConstants.COUNT }, (_, index) => ({
      content: `Comment number ${index + 1}`,
      blogId: BlogConstants.ID,
      authorId: UserConstants.ID
    }));
  }
}
