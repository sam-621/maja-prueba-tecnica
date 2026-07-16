import { Category } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

export const CategoryConstants = {
  EXISTING_ID: TestUtils.generateUUID(),
  EXISTING_NAME: 'Technology',
  EXISTING_SLUG: 'technology'
};

export class CategoryFixtures implements Fixture<Category> {
  entity = Category;

  async build(): Promise<Partial<Category>[]> {
    return [
      {
        id: CategoryConstants.EXISTING_ID,
        name: CategoryConstants.EXISTING_NAME,
        slug: CategoryConstants.EXISTING_SLUG
      }
    ];
  }
}
