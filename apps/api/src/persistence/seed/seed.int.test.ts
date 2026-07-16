import { beforeEach, describe, expect, test } from 'vitest';

import { Category } from '@/persistence/entities';
import { BASE_CATEGORIES, seedCategories } from '@/persistence/seed/seed';
import { TestUtils } from '@/tests/utils/test-utils';

describe('seedCategories - e2e', () => {
  const testUtils = new TestUtils();
  const repository = testUtils.getRepository(Category);

  beforeEach(async () => {
    await seedCategories(testUtils.dataSource);
  });

  test('inserts every base category', async () => {
    const categories = await repository.find();

    expect(categories).toHaveLength(BASE_CATEGORIES.length);
    expect(categories.map(category => category.slug).sort()).toEqual(
      BASE_CATEGORIES.map(category => category.slug).sort()
    );
  });

  test('is idempotent and does not duplicate on re-run', async () => {
    await seedCategories(testUtils.dataSource);
    await seedCategories(testUtils.dataSource);

    expect(await repository.count()).toBe(BASE_CATEGORIES.length);
  });
});
