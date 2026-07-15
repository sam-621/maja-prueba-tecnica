import { loadEnv } from './load-env';

export type Config = typeof config;

const envs = loadEnv();

export const config = {
  env: envs.NODE_ENV,
  port: envs.PORT,
  dbUrl: envs.DATABASE_URL,
  cors: envs.CORS,
  jwt: {
    secret: envs.JWT_SECRET,
    expiresIn: envs.JWT_EXPIRES_IN
  }
};
