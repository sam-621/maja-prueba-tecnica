import { Category } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

export const CategoryConstants = {
  TECH_ID: TestUtils.generateUUID(),
  TECH_NAME: 'Technology',
  FOOD_ID: TestUtils.generateUUID(),
  FOOD_NAME: 'Food'
};

export class CategoryFixtures implements Fixture<Category> {
  entity = Category;

  async build(): Promise<Partial<Category>[]> {
    return [
      {
        id: CategoryConstants.TECH_ID,
        name: CategoryConstants.TECH_NAME,
        slug: 'technology'
      },
      {
        id: CategoryConstants.FOOD_ID,
        name: CategoryConstants.FOOD_NAME,
        slug: 'food'
      }
    ];
  }
}
