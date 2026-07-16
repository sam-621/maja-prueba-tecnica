import { Post } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

import { OtherUserConstants, UserConstants } from './user.fixtures';

export const BlogConstants = {
  ID: TestUtils.generateUUID(),
  OTHER_ID: TestUtils.generateUUID(),
  Title: 'Original title',
  Content: 'Original content'
};

export class BlogFixtures implements Fixture<Post> {
  entity = Post;

  async build(): Promise<Partial<Post>[]> {
    return [
      {
        id: BlogConstants.ID,
        title: BlogConstants.Title,
        content: BlogConstants.Content,
        status: 'draft',
        authorId: UserConstants.ID
      },
      {
        id: BlogConstants.OTHER_ID,
        title: 'Someone else blog',
        content: 'Someone else content',
        status: 'draft',
        authorId: OtherUserConstants.ID
      }
    ];
  }
}
