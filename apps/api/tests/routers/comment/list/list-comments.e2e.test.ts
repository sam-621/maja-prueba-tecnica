import { beforeEach, describe, expect, test } from 'vitest';

import type { Comment } from '@/persistence/entities';
import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { BlogConstants, BlogFixtures } from './fixtures/blog.fixtures';
import { CommentConstants, CommentFixtures } from './fixtures/comment.fixtures';
import { UserConstants, UserFixtures } from './fixtures/user.fixtures';

type ListResponse = {
  comments: Comment[];
  pageInfo: {
    page: number;
    size: number;
    totalPages: number;
  };
};

describe('GET /blogs/:blogId/comments - e2e', async () => {
  const testUtils = new TestUtils();
  const testServer = await TestServer.create();

  beforeEach(async () => {
    await testUtils.loadFixtures([
      new UserFixtures(),
      new BlogFixtures(),
      new CommentFixtures()
    ]);
  });

  test('responds all the blog comments', async () => {
    const res = await testServer.get<ListResponse>(`/blogs/${BlogConstants.ID}/comments`);

    expect(res.body.data?.comments).toHaveLength(CommentConstants.COUNT);
    expect(res.body.data?.pageInfo).toMatchObject({ page: 1, size: 10, totalPages: 1 });

    expect(res.body.data?.comments[0]?.author).toMatchObject({
      id: UserConstants.ID,
      fullname: UserConstants.Fullname
    });
  });

  test('responds comments paginated with page and size', async () => {
    const first = await testServer.get<ListResponse>(
      `/blogs/${BlogConstants.ID}/comments?page=1&size=2`
    );

    expect(first.body.data?.comments).toHaveLength(2);
    expect(first.body.data?.pageInfo).toMatchObject({ page: 1, size: 2, totalPages: 2 });

    const second = await testServer.get<ListResponse>(
      `/blogs/${BlogConstants.ID}/comments?page=2&size=2`
    );

    expect(second.body.data?.comments).toHaveLength(1);
  });

  test('responds an empty list for a blog without comments', async () => {
    const res = await testServer.get<ListResponse>(
      `/blogs/${BlogConstants.EMPTY_ID}/comments`
    );

    expect(res.body.data?.comments).toHaveLength(0);
    expect(res.body.data?.pageInfo).toMatchObject({ totalPages: 0 });
  });

  test('responds BLOG_NOT_FOUND for an unknown blog', async () => {
    const res = await testServer.get(`/blogs/${TestUtils.generateUUID()}/comments`);

    expect(res.body.errorCode).toBe('BLOG_NOT_FOUND');
  });

  test('responds 400 for a malformed blogId', async () => {
    const res = await testServer.get('/blogs/not-a-uuid/comments');

    expect(res.statusCode).toBe(400);
  });

  test('responds 400 for a non-numeric page', async () => {
    const res = await testServer.get(`/blogs/${BlogConstants.ID}/comments?page=abc`);

    expect(res.statusCode).toBe(400);
  });
});
