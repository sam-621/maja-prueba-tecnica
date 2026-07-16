import { beforeEach, describe, expect, test } from 'vitest';

import type { Post } from '@/persistence/entities';
import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { BlogConstants, BlogFixtures } from './fixtures/blog.fixtures';
import { UserConstants, UserFixtures } from './fixtures/user.fixtures';

describe('GET /blogs/:id - e2e', async () => {
  const testUtils = new TestUtils();
  const testServer = await TestServer.create();

  const authToken = TestUtils.generateJWT({
    sub: UserConstants.ID,
    email: UserConstants.Email
  });

  const authHeader = { authorization: `Bearer ${authToken}` };

  beforeEach(async () => {
    await testUtils.loadFixtures([new UserFixtures(), new BlogFixtures()]);
  });

  test('returns the blog for an existing id', async () => {
    const res = await testServer.get<Post>(`/blogs/${BlogConstants.ID}`, {
      headers: authHeader
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      id: BlogConstants.ID,
      title: BlogConstants.Title,
      content: BlogConstants.Content,
      status: 'published',
      authorId: UserConstants.ID
    });
  });

  test('responds BLOG_NOT_FOUND for an unknown id', async () => {
    const res = await testServer.get(`/blogs/${TestUtils.generateUUID()}`, {
      headers: authHeader
    });

    expect(res.body.errorCode).toBe('BLOG_NOT_FOUND');
  });

  test('responds 400 for a malformed id', async () => {
    const res = await testServer.get('/blogs/not-a-uuid', { headers: authHeader });

    expect(res.statusCode).toBe(400);
  });

  test('responds 401 when no authorization header is provided', async () => {
    const res = await testServer.get(`/blogs/${BlogConstants.ID}`);

    expect(res.statusCode).toBe(401);
  });
});
