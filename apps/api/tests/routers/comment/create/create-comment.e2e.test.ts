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

    expect(res.data).toMatchObject({
      content: 'Nice post!',
      postId: BlogConstants.ID,
      authorId: UserConstants.ID
    });
    expect(res.data?.id).toMatch(TestUtils.Regex.UUID);
  });

  test('responds BLOG_NOT_FOUND for an unknown blog', async () => {
    const res = await testServer.post(
      `/blogs/${TestUtils.generateUUID()}/comments`,
      { content: 'Hello' },
      { headers: authHeader, shouldFail: true }
    );

    expect(res.errorCode).toBe('BLOG_NOT_FOUND');
  });

  test('responds 400 when the content is empty', async () => {
    await expect(
      testServer.post(
        `/blogs/${BlogConstants.ID}/comments`,
        { content: '' },
        { headers: authHeader }
      )
    ).rejects.toMatchObject({ cause: 400 });
  });

  test('responds 400 for a malformed blogId', async () => {
    await expect(
      testServer.post(
        '/blogs/not-a-uuid/comments',
        { content: 'Hello' },
        { headers: authHeader }
      )
    ).rejects.toMatchObject({ cause: 400 });
  });

  test('responds 401 when no authorization header is provided', async () => {
    await expect(
      testServer.post(`/blogs/${BlogConstants.ID}/comments`, { content: 'Hello' })
    ).rejects.toMatchObject({ cause: 401 });
  });
});
