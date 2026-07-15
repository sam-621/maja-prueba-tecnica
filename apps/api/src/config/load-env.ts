import { config } from 'dotenv';
import * as path from 'path';

import type { Env } from './env-schema';
import { envSchema } from './env-schema';

const ENV_FILES: Record<Env, string> = {
  local: '.env.local',
  test: '.env.test'
};

export const loadEnv = () => {
  const env = process.env.NODE_ENV as Env;

  const envFile = ENV_FILES[env];

  if (!envFile) throw new Error('Invalid env');

  config({ path: path.resolve(process.cwd(), `./${envFile}`), quiet: true });

  const parsedEnv = envSchema.safeParse(process.env);

  if (!parsedEnv.success) {
    throw new Error('Invalid envs', { cause: parsedEnv.error.message });
  }

  return parsedEnv.data;
};
