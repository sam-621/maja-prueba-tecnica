import { beforeEach, describe, expect, test } from 'vitest';

import type { Blog } from '@/persistence/entities';
import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { BlogConstants, BlogFixtures } from './fixtures/blog.fixtures';
import { CategoryConstants, CategoryFixtures } from './fixtures/category.fixtures';
import { UserConstants, UserFixtures } from './fixtures/user.fixtures';

describe('GET /blogs/:slug - e2e', async () => {
  const testUtils = new TestUtils();
  const testServer = await TestServer.create();

  const authorToken = TestUtils.generateJWT({
    sub: UserConstants.ID,
    email: UserConstants.Email
  });

  const authorHeader = { authorization: `Bearer ${authorToken}` };

  beforeEach(async () => {
    await testUtils.loadFixtures([
      new UserFixtures(),
      new CategoryFixtures(),
      new BlogFixtures()
    ]);
  });

  test('returns the blog for an existing slug without authentication', async () => {
    const res = await testServer.get<Blog>(`/blogs/${BlogConstants.Slug}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      id: BlogConstants.ID,
      title: BlogConstants.Title,
      slug: BlogConstants.Slug,
      content: BlogConstants.Content,
      status: 'published',
      authorId: UserConstants.ID
    });
    expect(res.body.data?.author).toMatchObject({
      id: UserConstants.ID,
      email: UserConstants.Email
    });
    expect(res.body.data?.categories).toEqual([
      expect.objectContaining({
        id: CategoryConstants.TECH_ID,
        name: CategoryConstants.TECH_NAME,
        slug: 'technology'
      })
    ]);
  });

  test('responds BLOG_NOT_FOUND for an unknown slug', async () => {
    const res = await testServer.get('/blogs/does-not-exist');

    expect(res.body.errorCode).toBe('BLOG_NOT_FOUND');
  });

  test('does not return an unpublished blog when are anonymous visitors', async () => {
    const res = await testServer.get(`/blogs/${BlogConstants.DraftSlug}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.errorCode).toBe('BLOG_NOT_FOUND');
  });

  test('returns the unpublished blog when the author is visiting', async () => {
    const res = await testServer.get<Blog>(`/blogs/${BlogConstants.DraftSlug}`, {
      headers: authorHeader
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      id: BlogConstants.DraftID,
      slug: BlogConstants.DraftSlug,
      status: 'draft'
    });
  });
});
