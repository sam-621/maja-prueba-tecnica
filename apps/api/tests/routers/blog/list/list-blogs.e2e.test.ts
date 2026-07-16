import { beforeEach, describe, expect, test } from 'vitest';

import type { Post } from '@/persistence/entities';
import type { TestResponse } from '@/tests/utils/test-server';
import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { BlogConstants, BlogFixtures } from './fixtures/blog.fixtures';
import { CategoryConstants, CategoryFixtures } from './fixtures/category.fixtures';
import { UserFixtures } from './fixtures/user.fixtures';

type ListResponse = {
  blogs: Post[];
  pageInfo: {
    page: number;
    size: number;
    totalPages: number;
  };
};

const ids = (res: TestResponse<ListResponse>) =>
  (res.body.data?.blogs ?? []).map(blog => blog.id).sort();

describe('GET /blogs - e2e', async () => {
  const testUtils = new TestUtils();
  const testServer = await TestServer.create();

  beforeEach(async () => {
    await testUtils.loadFixtures([
      new UserFixtures(),
      new CategoryFixtures(),
      new BlogFixtures()
    ]);
  });

  test('responds only published blogs', async () => {
    const res = await testServer.get<ListResponse>('/blogs');

    expect(ids(res)).toEqual([BlogConstants.TS_INTRO_ID, BlogConstants.PASTA_ID].sort());
    expect(res.body.data?.pageInfo).toMatchObject({ page: 1, size: 10, totalPages: 1 });
  });

  test('includes the categories of each blog', async () => {
    const res = await testServer.get<ListResponse>('/blogs');

    const tsIntro = res.body.data?.blogs.find(blog => blog.id === BlogConstants.TS_INTRO_ID);

    expect(tsIntro?.categories).toEqual([
      expect.objectContaining({
        id: CategoryConstants.TECH_ID,
        name: CategoryConstants.TECH_NAME,
        slug: 'technology'
      })
    ]);
  });

  test('responds blogs paginated with page and size', async () => {
    const first = await testServer.get<ListResponse>('/blogs?page=1&size=1');

    expect(first.body.data?.pageInfo).toMatchObject({ page: 1, size: 1, totalPages: 2 });
    expect(first.body.data?.blogs).toHaveLength(1);
  });

  test('responds all blogs filtered by search on blog title', async () => {
    const res = await testServer.get<ListResponse>('/blogs?search=TypeScript');

    expect(ids(res)).toEqual([BlogConstants.TS_INTRO_ID]);
  });

  test('responds all blogs filtered by a single category id', async () => {
    const res = await testServer.get<ListResponse>(
      `/blogs?categoryIds=${CategoryConstants.TECH_ID}`
    );

    expect(ids(res)).toEqual([BlogConstants.TS_INTRO_ID]);
  });

  test('responds blogs matching any of the comma-separated category ids', async () => {
    const res = await testServer.get<ListResponse>(
      `/blogs?categoryIds=${CategoryConstants.TECH_ID},${CategoryConstants.FOOD_ID}`
    );

    expect(ids(res)).toEqual([BlogConstants.TS_INTRO_ID, BlogConstants.PASTA_ID].sort());
  });

  test('responds all blogs combining multiple filters', async () => {
    const res = await testServer.get<ListResponse>(
      `/blogs?search=Pasta&categoryIds=${CategoryConstants.FOOD_ID}`
    );

    expect(ids(res)).toEqual([BlogConstants.PASTA_ID]);
  });

  test('responds 400 for a non-numeric page', async () => {
    const res = await testServer.get('/blogs?page=abc');

    expect(res.statusCode).toBe(400);
  });

  test('responds 400 for a malformed categoryId', async () => {
    const res = await testServer.get('/blogs?categoryIds=not-a-uuid');

    expect(res.statusCode).toBe(400);
  });
});
