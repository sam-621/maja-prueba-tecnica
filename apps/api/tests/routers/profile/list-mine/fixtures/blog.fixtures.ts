import { Blog,type Category } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

import { CategoryConstants } from './category.fixtures';
import { AliceAuthor, BobAuthor } from './user.fixtures';

export const BlogConstants = {
  TS_INTRO_ID: TestUtils.generateUUID(),
  TS_ADVANCED_ID: TestUtils.generateUUID(),
  ALICE_ARCHIVED_ID: TestUtils.generateUUID(),
  PASTA_ID: TestUtils.generateUUID()
};

const categoryRef = (id: string) => ({ id }) as Category;

export class BlogFixtures implements Fixture<Blog> {
  entity = Blog;

  async build(): Promise<Partial<Blog>[]> {
    return [
      {
        id: BlogConstants.TS_INTRO_ID,
        title: 'Intro to TypeScript',
        content: 'Getting started with TypeScript',
        status: 'published',
        authorId: AliceAuthor.ID,
        categories: [categoryRef(CategoryConstants.TECH_ID)]
      },
      {
        id: BlogConstants.TS_ADVANCED_ID,
        title: 'Advanced TypeScript',
        content: 'Deep dive into TypeScript',
        status: 'draft',
        authorId: AliceAuthor.ID,
        categories: [categoryRef(CategoryConstants.TECH_ID)]
      },
      {
        id: BlogConstants.ALICE_ARCHIVED_ID,
        title: 'Alice Old Recipes',
        content: 'Some archived cooking notes',
        status: 'archived',
        authorId: AliceAuthor.ID,
        categories: [categoryRef(CategoryConstants.FOOD_ID)]
      },
      {
        id: BlogConstants.PASTA_ID,
        title: 'Best Pasta Recipes',
        content: 'How to cook pasta',
        status: 'published',
        authorId: BobAuthor.ID,
        categories: [categoryRef(CategoryConstants.FOOD_ID)]
      }
    ];
  }
}
