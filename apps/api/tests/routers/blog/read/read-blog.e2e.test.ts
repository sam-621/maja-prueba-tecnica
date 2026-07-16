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
  });

  test('includes the categories of the blog', async () => {
    const res = await testServer.get<Blog>(`/blogs/${BlogConstants.Slug}`);

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
});
