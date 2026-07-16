import { Post } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

import { UserConstants } from './user.fixtures';

export const BlogConstants = {
  ID: TestUtils.generateUUID()
};

export class BlogFixtures implements Fixture<Post> {
  entity = Post;

  async build(): Promise<Partial<Post>[]> {
    return [
      {
        id: BlogConstants.ID,
        title: 'A blog with comments',
        content: 'Body',
        status: 'published',
        authorId: UserConstants.ID
      }
    ];
  }
}
