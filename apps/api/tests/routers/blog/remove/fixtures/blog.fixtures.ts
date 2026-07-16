import { Blog } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

import { OtherUserConstants, UserConstants } from './user.fixtures';

export const BlogConstants = {
  ID: TestUtils.generateUUID(),
  OTHER_ID: TestUtils.generateUUID(),
  Title: 'Blog to remove',
  Content: 'Content to remove'
};

export class BlogFixtures implements Fixture<Blog> {
  entity = Blog;

  async build(): Promise<Partial<Blog>[]> {
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
