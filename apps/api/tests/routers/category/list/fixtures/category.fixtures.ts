import { Category } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';

export const CategoryConstants = {
  BUSINESS: 'Business',
  FOOD: 'Food',
  TECHNOLOGY: 'Technology',
  TRAVEL: 'Travel'
};

export class CategoryFixtures implements Fixture<Category> {
  entity = Category;

  async build(): Promise<Partial<Category>[]> {
    return [
      { name: CategoryConstants.TECHNOLOGY, slug: 'technology' },
      { name: CategoryConstants.FOOD, slug: 'food' },
      { name: CategoryConstants.TRAVEL, slug: 'travel' },
      { name: CategoryConstants.BUSINESS, slug: 'business' }
    ];
  }
}
