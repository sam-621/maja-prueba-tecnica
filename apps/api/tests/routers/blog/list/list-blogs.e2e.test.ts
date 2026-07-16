import { beforeEach, describe, expect, test } from 'vitest';

import type { Post } from '@/persistence/entities';
import type { ResponseBody } from '@/tests/utils/test-server';
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

const ids = (res: ResponseBody<ListResponse>) =>
  (res.data?.blogs ?? []).map(blog => blog.id).sort();

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
    expect(res.data?.pageInfo).toMatchObject({ page: 1, size: 10, totalPages: 1 });
  });

  test('responds blogs paginated with page and size', async () => {
    const first = await testServer.get<ListResponse>('/blogs?page=1&size=1');

    expect(first.data?.pageInfo).toMatchObject({ page: 1, size: 1, totalPages: 2 });
    expect(first.data?.blogs).toHaveLength(1);
  });

  test('responds all blogs filtered by search on blog title', async () => {
    const res = await testServer.get<ListResponse>('/blogs?search=TypeScript');

    expect(ids(res)).toEqual([BlogConstants.TS_INTRO_ID]);
  });

  test('responds all blogs filtered by category id', async () => {
    const res = await testServer.get<ListResponse>(
      `/blogs?categoryId=${CategoryConstants.TECH_ID}`
    );

    expect(ids(res)).toEqual([BlogConstants.TS_INTRO_ID]);
  });

  test('responds all blogs combining multiple filters', async () => {
    const res = await testServer.get<ListResponse>(
      `/blogs?search=Pasta&categoryId=${CategoryConstants.FOOD_ID}`
    );

    expect(ids(res)).toEqual([BlogConstants.PASTA_ID]);
  });

  test('responds 400 for a non-numeric page', async () => {
    await expect(testServer.get('/blogs?page=abc')).rejects.toMatchObject({ cause: 400 });
  });

  test('responds 400 for a malformed categoryId', async () => {
    await expect(testServer.get('/blogs?categoryId=not-a-uuid')).rejects.toMatchObject({
      cause: 400
    });
  });
});
