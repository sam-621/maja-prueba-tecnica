import { existsSync } from 'node:fs';

import dotenv from 'dotenv';

process.env.NODE_ENV = 'test';

if (!existsSync('.env.test')) {
  throw new Error('Missing .env.test — int/e2e tests need a test database');
}

dotenv.config({ path: '.env.test', override: true, quiet: true });
