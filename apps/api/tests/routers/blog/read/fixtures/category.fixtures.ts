import { Category } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

export const CategoryConstants = {
  TECH_ID: TestUtils.generateUUID(),
  TECH_NAME: 'Technology'
};

export class CategoryFixtures implements Fixture<Category> {
  entity = Category;

  async build(): Promise<Partial<Category>[]> {
    return [
      {
        id: CategoryConstants.TECH_ID,
        name: CategoryConstants.TECH_NAME,
        slug: 'technology'
      }
    ];
  }
}
