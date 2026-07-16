import { beforeEach, describe, expect, test } from 'vitest';

import type { Comment } from '@/persistence/entities';
import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { BlogConstants, BlogFixtures } from './fixtures/blog.fixtures';
import { UserConstants, UserFixtures } from './fixtures/user.fixtures';

describe('POST /blogs/:blogId/comments - e2e', async () => {
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

  test('creates a comment on a blog', async () => {
    const res = await testServer.post<Comment>(
      `/blogs/${BlogConstants.ID}/comments`,
      { content: 'Nice post!' },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toMatchObject({
      content: 'Nice post!',
      blogId: BlogConstants.ID,
      authorId: UserConstants.ID
    });
    expect(res.body.data?.id).toMatch(TestUtils.Regex.UUID);
  });

  test('responds BLOG_NOT_FOUND for an unknown blog', async () => {
    const res = await testServer.post(
      `/blogs/${TestUtils.generateUUID()}/comments`,
      { content: 'Hello' },
      { headers: authHeader }
    );

    expect(res.body.errorCode).toBe('BLOG_NOT_FOUND');
  });

  test('does not allow commenting on an unpublished blog, even for its author', async () => {
    const res = await testServer.post(
      `/blogs/${BlogConstants.DraftID}/comments`,
      { content: 'Hello' },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(404);
    expect(res.body.errorCode).toBe('BLOG_NOT_FOUND');
  });

  test('responds 400 when the content is empty', async () => {
    const res = await testServer.post(
      `/blogs/${BlogConstants.ID}/comments`,
      { content: '' },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(400);
  });

  test('responds 400 for a malformed blogId', async () => {
    const res = await testServer.post(
      '/blogs/not-a-uuid/comments',
      { content: 'Hello' },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(400);
  });

  test('responds 401 when no authorization header is provided', async () => {
    const res = await testServer.post(`/blogs/${BlogConstants.ID}/comments`, {
      content: 'Hello'
    });

    expect(res.statusCode).toBe(401);
  });
});
