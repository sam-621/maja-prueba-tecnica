import { Comment } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

import { BlogConstants } from './blog.fixtures';
import { OtherUserConstants, UserConstants } from './user.fixtures';

export const CommentConstants = {
  ID: TestUtils.generateUUID(),
  OTHER_ID: TestUtils.generateUUID()
};

export class CommentFixtures implements Fixture<Comment> {
  entity = Comment;

  async build(): Promise<Partial<Comment>[]> {
    return [
      {
        id: CommentConstants.ID,
        content: 'My comment',
        postId: BlogConstants.ID,
        authorId: UserConstants.ID
      },
      {
        id: CommentConstants.OTHER_ID,
        content: 'Someone else comment',
        postId: BlogConstants.ID,
        authorId: OtherUserConstants.ID
      }
    ];
  }
}
