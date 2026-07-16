import { beforeEach, describe, expect, test } from 'vitest';

import type { Blog } from '@/persistence/entities';
import type { TestResponse } from '@/tests/utils/test-server';
import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { BlogConstants, BlogFixtures } from './fixtures/blog.fixtures';
import { CategoryConstants, CategoryFixtures } from './fixtures/category.fixtures';
import { AliceAuthor, BobAuthor, UserFixtures } from './fixtures/user.fixtures';

type ListResponse = {
  blogs: Blog[];
  pageInfo: {
    page: number;
    size: number;
    totalPages: number;
  };
};

const ids = (res: TestResponse<ListResponse>) =>
  (res.body.data?.blogs ?? []).map(blog => blog.id).sort();

const authHeaderFor = (author: { ID: string; Email: string }) => ({
  authorization: `Bearer ${TestUtils.generateJWT({ sub: author.ID, email: author.Email })}`
});

describe('GET /me/blogs - e2e', async () => {
  const testUtils = new TestUtils();
  const testServer = await TestServer.create();

  const aliceHeader = authHeaderFor(AliceAuthor);

  beforeEach(async () => {
    await testUtils.loadFixtures([
      new UserFixtures(),
      new CategoryFixtures(),
      new BlogFixtures()
    ]);
  });

  test('responds all user blogs', async () => {
    const res = await testServer.get<ListResponse>('/me/blogs', {
      headers: aliceHeader
    });

    expect(res.statusCode).toBe(200);
    expect(ids(res)).toEqual(
      [
        BlogConstants.TS_INTRO_ID,
        BlogConstants.TS_ADVANCED_ID,
        BlogConstants.ALICE_ARCHIVED_ID
      ].sort()
    );
    expect(res.body.data?.pageInfo).toMatchObject({ page: 1, size: 10, totalPages: 1 });
  });

  test('includes the categories of each blog', async () => {
    const res = await testServer.get<ListResponse>('/me/blogs', {
      headers: aliceHeader
    });

    const tsIntro = res.body.data?.blogs.find(blog => blog.id === BlogConstants.TS_INTRO_ID);

    expect(tsIntro?.categories).toEqual([
      expect.objectContaining({
        id: CategoryConstants.TECH_ID,
        name: CategoryConstants.TECH_NAME,
        slug: 'technology'
      })
    ]);
  });

  test('does not include blogs authored by other users', async () => {
    const res = await testServer.get<ListResponse>('/me/blogs', {
      headers: authHeaderFor(BobAuthor)
    });

    expect(ids(res)).toEqual([BlogConstants.PASTA_ID]);
  });

  test('responds blogs paginated', async () => {
    const first = await testServer.get<ListResponse>('/me/blogs?page=1&size=1', {
      headers: aliceHeader
    });

    expect(first.body.data?.pageInfo).toMatchObject({ page: 1, size: 1, totalPages: 3 });
    expect(first.body.data?.blogs).toHaveLength(1);
  });

  test('responds all user blogs filtered by search', async () => {
    const res = await testServer.get<ListResponse>('/me/blogs?search=TypeScript', {
      headers: aliceHeader
    });

    expect(ids(res)).toEqual(
      [BlogConstants.TS_INTRO_ID, BlogConstants.TS_ADVANCED_ID].sort()
    );
  });

  test('responds all user blogs filtered by a single category id', async () => {
    const res = await testServer.get<ListResponse>(
      `/me/blogs?categoryIds=${CategoryConstants.FOOD_ID}`,
      { headers: aliceHeader }
    );

    expect(ids(res)).toEqual([BlogConstants.ALICE_ARCHIVED_ID]);
  });

  test('responds user blogs matching any of the comma-separated category ids', async () => {
    const res = await testServer.get<ListResponse>(
      `/me/blogs?categoryIds=${CategoryConstants.TECH_ID},${CategoryConstants.FOOD_ID}`,
      { headers: aliceHeader }
    );

    expect(ids(res)).toEqual(
      [
        BlogConstants.TS_INTRO_ID,
        BlogConstants.TS_ADVANCED_ID,
        BlogConstants.ALICE_ARCHIVED_ID
      ].sort()
    );
  });

  test('responds all user blogs combining multiple filters', async () => {
    const res = await testServer.get<ListResponse>(
      `/me/blogs?search=TypeScript&categoryIds=${CategoryConstants.TECH_ID}`,
      { headers: aliceHeader }
    );

    expect(ids(res)).toEqual(
      [BlogConstants.TS_INTRO_ID, BlogConstants.TS_ADVANCED_ID].sort()
    );
  });

  test('responds 400 for a non-numeric page', async () => {
    const res = await testServer.get('/me/blogs?page=abc', { headers: aliceHeader });

    expect(res.statusCode).toBe(400);
  });

  test('responds 400 for a malformed categoryId', async () => {
    const res = await testServer.get('/me/blogs?categoryIds=not-a-uuid', {
      headers: aliceHeader
    });

    expect(res.statusCode).toBe(400);
  });

  test('responds 401 when no authorization header is provided', async () => {
    const res = await testServer.get('/me/blogs');

    expect(res.statusCode).toBe(401);
  });
});
