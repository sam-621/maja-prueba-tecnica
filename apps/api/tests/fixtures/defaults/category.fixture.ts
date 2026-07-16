import type { Category } from '@/persistence/entities';

export const DefaultCategoryFixture = (): Partial<Category> => {
  const suffix = crypto.randomUUID().slice(0, 8);

  return {
    id: crypto.randomUUID(),
    name: `Category ${suffix}`,
    slug: `category-${suffix}`
  };
};
