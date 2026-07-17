import type { DataSource } from 'typeorm';

import { logger } from '../../logger/logger';
import { Category } from '../entities';

export const BASE_CATEGORIES: readonly { name: string; slug: string }[] = [
  { name: 'Tecnología', slug: 'tecnolog-a' },
  { name: 'Comida', slug: 'comida' },
  { name: 'Viajes', slug: 'viajes' },
  { name: 'Lifestyle', slug: 'lifestyle' },
  { name: 'Negocios', slug: 'negocios' }
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
