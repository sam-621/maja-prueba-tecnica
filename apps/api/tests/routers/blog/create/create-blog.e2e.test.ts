import { beforeEach, describe, expect, test } from 'vitest';

import type { Blog, Category } from '@/persistence/entities';
import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { CategoryConstants, CategoryFixtures } from './fixtures/category.fixtures';
import { UserConstants, UserFixtures } from './fixtures/user.fixtures';

type BlogWithCategories = Blog & { categories: Category[] };

describe('POST /blogs - e2e', async () => {
  const testUtils = new TestUtils();
  const testServer = await TestServer.create();

  const authToken = TestUtils.generateJWT({
    sub: UserConstants.ID,
    email: UserConstants.Email
  });

  const authHeader = { authorization: `Bearer ${authToken}` };

  beforeEach(async () => {
    await testUtils.loadFixtures([new UserFixtures(), new CategoryFixtures()]);
  });

  test('creates a draft blog by default', async () => {
    const res = await testServer.post<Blog>(
      '/blogs',
      { title: 'My first blog', content: 'Hello world' },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toMatchObject({
      title: 'My first blog',
      content: 'Hello world',
      status: 'draft',
      authorId: UserConstants.ID
    });
    expect(res.body.data?.id).toMatch(TestUtils.Regex.UUID);
  });

  test('generates a slug from the title', async () => {
    const res = await testServer.post<Blog>(
      '/blogs',
      { title: 'Hello World Post', content: 'Body' },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(201);
    expect(res.body.data?.slug).toBe('hello-world-post');
  });

  test('appends a suffix when the slug already exists', async () => {
    await testServer.post<Blog>(
      '/blogs',
      { title: 'Duplicate Title', content: 'First' },
      { headers: authHeader }
    );

    const second = await testServer.post<Blog>(
      '/blogs',
      { title: 'Duplicate Title', content: 'Second' },
      { headers: authHeader }
    );

    expect(second.statusCode).toBe(201);
    expect(second.body.data?.slug).toBe('duplicate-title-2');
  });

  test('creates a blog with the provided status', async () => {
    const res = await testServer.post<Blog>(
      '/blogs',
      { title: 'Published blog', content: 'Body', status: 'published' },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(201);
    expect(res.body.data?.status).toBe('published');
  });

  test('assigns the provided categories to the created blog', async () => {
    const res = await testServer.post<BlogWithCategories>(
      '/blogs',
      {
        title: 'Categorized blog',
        content: 'Body',
        categoryIds: [CategoryConstants.TECH_ID, CategoryConstants.FOOD_ID]
      },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(201);
    expect((res.body.data?.categories ?? []).map(category => category.id).sort()).toEqual(
      [CategoryConstants.TECH_ID, CategoryConstants.FOOD_ID].sort()
    );
  });

  test('assigns only the categories that exist, ignoring unknown ids', async () => {
    const res = await testServer.post<BlogWithCategories>(
      '/blogs',
      {
        title: 'Partially categorized',
        content: 'Body',
        categoryIds: [CategoryConstants.TECH_ID, TestUtils.generateUUID()]
      },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(201);
    expect((res.body.data?.categories ?? []).map(category => category.id)).toEqual([
      CategoryConstants.TECH_ID
    ]);
  });

  test('responds 400 for a malformed category id', async () => {
    const res = await testServer.post(
      '/blogs',
      { title: 'Bad category', content: 'Body', categoryIds: ['not-a-uuid'] },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(400);
  });

  test('responds 401 when no authorization header is provided', async () => {
    const res = await testServer.post('/blogs', { title: 'No auth', content: 'Body' });

    expect(res.statusCode).toBe(401);
  });

  test('responds 400 when the body is malformed', async () => {
    const res = await testServer.post('/blogs', { title: '' }, { headers: authHeader });

    expect(res.statusCode).toBe(400);
  });

  test('responds 400 for an unknown status', async () => {
    const res = await testServer.post(
      '/blogs',
      { title: 'Bad status', content: 'Body', status: 'unknown' },
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(400);
  });
});
