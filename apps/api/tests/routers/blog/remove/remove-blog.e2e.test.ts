import { beforeEach, describe, expect, test } from 'vitest';

import { Post } from '@/persistence/entities';
import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { BlogConstants, BlogFixtures } from './fixtures/blog.fixtures';
import { UserConstants, UserFixtures } from './fixtures/user.fixtures';

describe('DELETE /blogs/:id - e2e', async () => {
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

  test('removes an owned blog', async () => {
    const res = await testServer.delete<{ id: string }>(`/blogs/${BlogConstants.ID}`, {
      headers: authHeader
    });

    expect(res.data).toMatchObject({ id: BlogConstants.ID });

    const persisted = await testUtils.getRepository(Post).findOneBy({
      id: BlogConstants.ID
    });

    expect(persisted).toBeNull();
  });

  test('responds BLOG_NOT_FOUND for an unknown id', async () => {
    const res = await testServer.delete(`/blogs/${TestUtils.generateUUID()}`, {
      headers: authHeader,
      shouldFail: true
    });

    expect(res.errorCode).toBe('BLOG_NOT_FOUND');
  });

  test('responds BLOG_FORBIDDEN when removing a blog owned by someone else', async () => {
    const res = await testServer.delete(`/blogs/${BlogConstants.OTHER_ID}`, {
      headers: authHeader,
      shouldFail: true
    });

    expect(res.errorCode).toBe('BLOG_FORBIDDEN');

    const persisted = await testUtils.getRepository(Post).findOneBy({
      id: BlogConstants.OTHER_ID
    });

    expect(persisted).not.toBeNull();
  });

  test('responds 400 for a malformed id', async () => {
    await expect(
      testServer.delete('/blogs/not-a-uuid', { headers: authHeader })
    ).rejects.toMatchObject({ cause: 400 });
  });

  test('responds 401 when no authorization header is provided', async () => {
    await expect(
      testServer.delete(`/blogs/${BlogConstants.ID}`)
    ).rejects.toMatchObject({ cause: 401 });
  });
});
