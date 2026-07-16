import { afterAll, beforeAll, beforeEach } from 'vitest';

import { dataSource, initDataSource } from '@/persistence/data-source';

beforeAll(async () => {
  await initDataSource();
});

beforeEach(async () => {
  const tables = dataSource.entityMetadatas.map(metadata => `"${metadata.tableName}"`);

  if (tables.length === 0) return;

  await dataSource.query(`TRUNCATE TABLE ${tables.join(', ')} RESTART IDENTITY CASCADE`);
});

afterAll(async () => {
  if (dataSource.isInitialized) await dataSource.destroy();
});
