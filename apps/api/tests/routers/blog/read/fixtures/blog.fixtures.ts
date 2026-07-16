import { type Category, Post } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

import { CategoryConstants } from './category.fixtures';
import { UserConstants } from './user.fixtures';

const categoryRef = (id: string) => ({ id }) as Category;

export const BlogConstants = {
  ID: TestUtils.generateUUID(),
  Title: 'Existing blog',
  Content: 'Existing content'
};

export class BlogFixtures implements Fixture<Post> {
  entity = Post;

  async build(): Promise<Partial<Post>[]> {
    return [
      {
        id: BlogConstants.ID,
        title: BlogConstants.Title,
        content: BlogConstants.Content,
        status: 'published',
        authorId: UserConstants.ID,
        categories: [categoryRef(CategoryConstants.TECH_ID)]
      }
    ];
  }
}
