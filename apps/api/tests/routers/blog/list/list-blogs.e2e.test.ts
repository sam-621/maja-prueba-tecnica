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

  test('responds all blogs', async () => {
    const res = await testServer.get<ListResponse>('/blogs');

    expect(res.data?.blogs).toHaveLength(4);
    expect(res.data?.pageInfo).toMatchObject({ page: 1, size: 10, totalPages: 1 });
  });

  test('responds blogs paginated with page and size', async () => {
    const first = await testServer.get<ListResponse>('/blogs?page=1&size=2');

    expect(first.data?.pageInfo).toMatchObject({ page: 1, size: 2, totalPages: 2 });
    expect(first.data?.blogs).toHaveLength(2);
  });

  test('responds all blogs with filtered by author fullname', async () => {
    const res = await testServer.get<ListResponse>('/blogs?fullname=alice');

    expect(ids(res)).toEqual(
      [BlogConstants.TS_INTRO_ID, BlogConstants.TS_ADVANCED_ID].sort()
    );
  });

  test('responds all blogs filtered by blog title', async () => {
    const res = await testServer.get<ListResponse>('/blogs?title=TypeScript');

    expect(ids(res)).toEqual(
      [BlogConstants.TS_INTRO_ID, BlogConstants.TS_ADVANCED_ID].sort()
    );
  });

  test('responds all blogs filtered by category id', async () => {
    const res = await testServer.get<ListResponse>(
      `/blogs?categoryId=${CategoryConstants.TECH_ID}`
    );

    expect(ids(res)).toEqual(
      [BlogConstants.TS_INTRO_ID, BlogConstants.TS_ADVANCED_ID].sort()
    );
  });

  test('responds all blogs combining multiple filters', async () => {
    const res = await testServer.get<ListResponse>(
      `/blogs?fullname=bob&categoryId=${CategoryConstants.FOOD_ID}`
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
