import type { User } from '@/persistence/entities';

export const DefaultUserFixture = (): Partial<User> => ({
  id: crypto.randomUUID(),
  email: `user-${crypto.randomUUID().slice(0, 8)}@test.com`,
  fullname: 'Test User',
  passwordHash: 'password_hash'
});
