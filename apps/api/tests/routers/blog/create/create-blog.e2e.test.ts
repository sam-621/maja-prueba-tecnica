import { beforeEach, describe, expect, test } from 'vitest';

import type { Post } from '@/persistence/entities';
import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { UserConstants, UserFixtures } from './fixtures/user.fixtures';

describe('POST /blogs - e2e', async () => {
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

  test('creates a draft blog by default', async () => {
    const res = await testServer.post<Post>(
      '/blogs',
      { title: 'My first blog', content: 'Hello world' },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toMatchObject({
      title: 'My first blog',
      content: 'Hello world',
      status: 'draft',
      authorId: UserConstants.ID
    });
    expect(res.body.data?.id).toMatch(TestUtils.Regex.UUID);
  });

  test('creates a blog with the provided status', async () => {
    const res = await testServer.post<Post>(
      '/blogs',
      { title: 'Published blog', content: 'Body', status: 'published' },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(201);
    expect(res.body.data?.status).toBe('published');
  });

  test('responds 401 when no authorization header is provided', async () => {
    const res = await testServer.post('/blogs', { title: 'No auth', content: 'Body' });

    expect(res.statusCode).toBe(401);
  });

  test('responds 400 when the body is malformed', async () => {
    const res = await testServer.post('/blogs', { title: '' }, { headers: authHeader });

    expect(res.statusCode).toBe(400);
  });

  test('responds 400 for an unknown status', async () => {
    const res = await testServer.post(
      '/blogs',
      { title: 'Bad status', content: 'Body', status: 'unknown' },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(400);
  });
});
