import { Blog,type Category } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

import { CategoryConstants } from './category.fixtures';
import { UserConstants } from './user.fixtures';

const categoryRef = (id: string) => ({ id }) as Category;

export const BlogConstants = {
  ID: TestUtils.generateUUID(),
  Title: 'Existing blog',
  Slug: 'existing-blog',
  Content: 'Existing content'
};

export class BlogFixtures implements Fixture<Blog> {
  entity = Blog;

  async build(): Promise<Partial<Blog>[]> {
    return [
      {
        id: BlogConstants.ID,
        title: BlogConstants.Title,
        slug: BlogConstants.Slug,
        content: BlogConstants.Content,
        status: 'published',
        authorId: UserConstants.ID,
        categories: [categoryRef(CategoryConstants.TECH_ID)]
      }
    ];
  }
}
