import type { DataSource } from 'typeorm';

import { logger } from '../../logger/logger';
import { Category } from '../entities';

export const BASE_CATEGORIES: readonly { name: string; slug: string }[] = [
  { name: 'Technology', slug: 'technology' },
  { name: 'Food', slug: 'food' },
  { name: 'Travel', slug: 'travel' },
  { name: 'Lifestyle', slug: 'lifestyle' },
  { name: 'Business', slug: 'business' }
];

export const seedCategories = async (dataSource: DataSource): Promise<void> => {
  const result = await dataSource
    .getRepository(Category)
    .createQueryBuilder()
    .insert()
    .into(Category)
    .values([...BASE_CATEGORIES])
    .orIgnore()
    .execute();

  logger.info(`Seeded ${result.identifiers.filter(Boolean).length} base categories`);
};
