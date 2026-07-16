import { beforeEach, describe, expect, test } from 'vitest';

import type { User } from '@/persistence/entities';
import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { UserConstants, UserFixtures } from './fixtures/user.fixtures';

describe('GET /whoami - e2e', async () => {
  const testUtils = new TestUtils();
  const testServer = await TestServer.create();

  const authToken = TestUtils.generateJWT({
    sub: UserConstants.ID,
    email: UserConstants.Email
  });

  const authHeader = { authorization: `Bearer ${authToken}` };

  beforeEach(async () => {
    await testUtils.loadFixtures([new UserFixtures()]);
  });

  test('returns the current user profile', async () => {
    const res = await testServer.get<User>('/whoami', { headers: authHeader });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      id: UserConstants.ID,
      email: UserConstants.Email,
      fullname: UserConstants.Fullname
    });
    expect(res.body.data?.id).toMatch(TestUtils.Regex.UUID);
  });

  test('responds 401 when no authorization header is provided', async () => {
    const res = await testServer.get('/whoami');

    expect(res.statusCode).toBe(401);
  });

  test('responds 401 when the token is invalid', async () => {
    const res = await testServer.get('/whoami', {
      headers: { authorization: 'Bearer not-a-real-token' }
    });

    expect(res.statusCode).toBe(401);
  });

  test('responds 401 when the header does not use the Bearer scheme', async () => {
    const res = await testServer.get('/whoami', {
      headers: { authorization: `Basic ${authToken}` }
    });

    expect(res.statusCode).toBe(401);
  });
});
