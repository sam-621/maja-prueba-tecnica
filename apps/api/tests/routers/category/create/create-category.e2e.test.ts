import { beforeEach, describe, expect, test } from 'vitest';

import type { Category } from '@/persistence/entities';
import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { CategoryConstants, CategoryFixtures } from './fixtures/category.fixtures';
import { UserConstants, UserFixtures } from './fixtures/user.fixtures';

describe('POST /categories - e2e', async () => {
  const testUtils = new TestUtils();
  const testServer = await TestServer.create();

  const authToken = TestUtils.generateJWT({
    sub: UserConstants.ID,
    email: UserConstants.Email
  });

  const authHeader = { authorization: `Bearer ${authToken}` };

  beforeEach(async () => {
    await testUtils.loadFixtures([new UserFixtures(), new CategoryFixtures()]);
  });

  test('creates a non-existent category', async () => {
    const res = await testServer.post<Category>(
      '/categories',
      { name: 'Web Development' },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toMatchObject({
      name: 'Web Development',
      slug: 'web-development'
    });
    expect(res.body.data?.id).toMatch(TestUtils.Regex.UUID);
  });

  test('responds CATEGORY_ALREADY_EXISTS for a duplicate name', async () => {
    const res = await testServer.post(
      '/categories',
      { name: CategoryConstants.EXISTING_NAME },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(409);
    expect(res.body.errorCode).toBe('CATEGORY_ALREADY_EXISTS');
  });

  test('responds CATEGORY_ALREADY_EXISTS when the derived slug collides', async () => {
    const res = await testServer.post(
      '/categories',
      { name: 'technology' },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(409);
    expect(res.body.errorCode).toBe('CATEGORY_ALREADY_EXISTS');
  });

  test('responds 400 for an empty name', async () => {
    const res = await testServer.post(
      '/categories',
      { name: '' },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(400);
  });

  test('responds 401 when no authorization header is provided', async () => {
    const res = await testServer.post('/categories', { name: 'Sports' });

    expect(res.statusCode).toBe(401);
  });
});
