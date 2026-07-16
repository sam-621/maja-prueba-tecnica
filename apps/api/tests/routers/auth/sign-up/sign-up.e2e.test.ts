import { beforeEach, describe, expect, test } from 'vitest';

import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { UserConstants, UserFixtures } from './fixtures/user.fixtures';

describe('POST /signup - e2e', async () => {
  const testUtils = new TestUtils();
  const testServer = await TestServer.create();

  beforeEach(async () => {
    await testUtils.loadFixtures([new UserFixtures()]);
  });

  test('returns an access token for a new email', async () => {
    const res = await testServer.post('/signup', {
      email: 'john@test.com',
      password: UserConstants.Password,
      fullname: 'John Doe'
    });

    expect(res.data).toMatch(TestUtils.Regex.JWT);
  });

  test('returns EMAIL_ALREADY_TAKEN for an existing email', async () => {
    const res = await testServer.post(
      '/signup',
      {
        email: UserConstants.Email,
        password: UserConstants.Password,
        fullname: 'Jane Doe'
      },
      { shouldFail: true }
    );

    expect(res.errorCode).toBe('EMAIL_ALREADY_TAKEN');
  });
});
