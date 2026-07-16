import { Category } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

export const CategoryConstants = {
  TECH_ID: TestUtils.generateUUID(),
  FOOD_ID: TestUtils.generateUUID()
};

export class CategoryFixtures implements Fixture<Category> {
  entity = Category;

  async build(): Promise<Partial<Category>[]> {
    return [
      { id: CategoryConstants.TECH_ID, name: 'Technology', slug: 'technology' },
      { id: CategoryConstants.FOOD_ID, name: 'Food', slug: 'food' }
    ];
  }
}
