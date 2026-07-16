import { beforeEach, describe, expect, test } from 'vitest';

import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { UserConstants, UserFixtures } from './fixtures/user.fixtures';

describe('POST /login - e2e', async () => {
  const testUtils = new TestUtils();
  const testServer = await TestServer.create();

  beforeEach(async () => {
    await testUtils.loadFixtures([new UserFixtures()]);
  });

  test('returns an access token for valid credentials', async () => {
    const res = await testServer.post('/login', {
      email: UserConstants.Email,
      password: UserConstants.Password
    });

    expect(res.data).toMatch(TestUtils.Regex.JWT);
  });

  test('returns INVALID_CREDENTIALS for a wrong password', async () => {
    const res = await testServer.post(
      '/login',
      { email: UserConstants.Email, password: 'wrong-password' },
      { shouldFail: true }
    );

    expect(res.errorCode).toBe('INVALID_CREDENTIALS');
  });

  test('returns INVALID_CREDENTIALS for an unknown email', async () => {
    const res = await testServer.post(
      '/login',
      { email: 'nobody@test.com', password: UserConstants.Password },
      { shouldFail: true }
    );

    expect(res.errorCode).toBe('INVALID_CREDENTIALS');
  });
});
