import z from 'zod';

export type Env = z.infer<typeof envSchema>['NODE_ENV'];

export const envSchema = z.object({
  NODE_ENV: z.enum(['test', 'local']).default('local'),
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  CORS: z.string().transform(val =>
    val
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  ),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.coerce.number()
});
