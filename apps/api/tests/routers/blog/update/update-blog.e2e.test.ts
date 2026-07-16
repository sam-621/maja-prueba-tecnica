import { beforeEach, describe, expect, test } from 'vitest';

import type { Post } from '@/persistence/entities';
import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { BlogConstants, BlogFixtures } from './fixtures/blog.fixtures';
import { UserConstants, UserFixtures } from './fixtures/user.fixtures';

describe('PATCH /blogs/:id - e2e', async () => {
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

  test('updates the provided fields of an owned blog', async () => {
    const res = await testServer.patch<Post>(
      `/blogs/${BlogConstants.ID}`,
      { title: 'Updated title', status: 'published' },
      { headers: authHeader }
    );

    expect(res.data).toMatchObject({
      id: BlogConstants.ID,
      title: 'Updated title',
      content: BlogConstants.Content,
      status: 'published'
    });
  });

  test('responds BLOG_NOT_FOUND for an unknown id', async () => {
    const res = await testServer.patch(
      `/blogs/${TestUtils.generateUUID()}`,
      { title: 'Nope' },
      { headers: authHeader, shouldFail: true }
    );

    expect(res.errorCode).toBe('BLOG_NOT_FOUND');
  });

  test('responds BLOG_FORBIDDEN when updating a blog owned by someone else', async () => {
    const res = await testServer.patch(
      `/blogs/${BlogConstants.OTHER_ID}`,
      { title: 'Hijack' },
      { headers: authHeader, shouldFail: true }
    );

    expect(res.errorCode).toBe('BLOG_FORBIDDEN');
  });

  test('responds 400 for a malformed id', async () => {
    await expect(
      testServer.patch('/blogs/not-a-uuid', { title: 'x' }, { headers: authHeader })
    ).rejects.toMatchObject({ cause: 400 });
  });

  test('responds 400 for an unknown status', async () => {
    await expect(
      testServer.patch(
        `/blogs/${BlogConstants.ID}`,
        { status: 'unknown' },
        { headers: authHeader }
      )
    ).rejects.toMatchObject({ cause: 400 });
  });

  test('responds 401 when no authorization header is provided', async () => {
    await expect(
      testServer.patch(`/blogs/${BlogConstants.ID}`, { title: 'No auth' })
    ).rejects.toMatchObject({ cause: 401 });
  });
});
