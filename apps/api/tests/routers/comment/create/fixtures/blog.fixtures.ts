import { Blog } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

import { UserConstants } from './user.fixtures';

export const BlogConstants = {
  ID: TestUtils.generateUUID()
};

export class BlogFixtures implements Fixture<Blog> {
  entity = Blog;

  async build(): Promise<Partial<Blog>[]> {
    return [
      {
        id: BlogConstants.ID,
        title: 'A blog to comment on',
        content: 'Body',
        status: 'published',
        authorId: UserConstants.ID
      }
    ];
  }
}
