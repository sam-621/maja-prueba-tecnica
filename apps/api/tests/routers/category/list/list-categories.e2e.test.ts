import { beforeEach, describe, expect, test } from 'vitest';

import type { Category } from '@/persistence/entities';
import type { TestResponse } from '@/tests/utils/test-server';
import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { CategoryConstants, CategoryFixtures } from './fixtures/category.fixtures';

type ListResponse = {
  categories: Category[];
  pageInfo: {
    page: number;
    size: number;
    totalPages: number;
  };
};

const names = (res: TestResponse<ListResponse>) =>
  (res.body.data?.categories ?? []).map(category => category.name);

describe('GET /categories - e2e', async () => {
  const testUtils = new TestUtils();
  const testServer = await TestServer.create();

  beforeEach(async () => {
    await testUtils.loadFixtures([new CategoryFixtures()]);
  });

  test('responds all categories ordered by name by default', async () => {
    const res = await testServer.get<ListResponse>('/categories');

    expect(res.statusCode).toBe(200);
    expect(names(res)).toEqual([
      CategoryConstants.BUSINESS,
      CategoryConstants.FOOD,
      CategoryConstants.TECHNOLOGY,
      CategoryConstants.TRAVEL
    ]);
    expect(res.body.data?.pageInfo).toMatchObject({ page: 1, size: 10, totalPages: 1 });
  });

  test('responds categories paginated with page and size', async () => {
    const first = await testServer.get<ListResponse>('/categories?page=1&size=2');

    expect(first.body.data?.pageInfo).toMatchObject({ page: 1, size: 2, totalPages: 2 });
    expect(names(first)).toEqual([CategoryConstants.BUSINESS, CategoryConstants.FOOD]);

    const second = await testServer.get<ListResponse>('/categories?page=2&size=2');

    expect(names(second)).toEqual([
      CategoryConstants.TECHNOLOGY,
      CategoryConstants.TRAVEL
    ]);
  });

  test('responds categories filtered by name', async () => {
    const res = await testServer.get<ListResponse>('/categories?search=tra');

    expect(names(res)).toEqual([CategoryConstants.TRAVEL]);
  });

  test('responds 400 for a non-numeric page', async () => {
    const res = await testServer.get('/categories?page=abc');

    expect(res.statusCode).toBe(400);
  });
});
