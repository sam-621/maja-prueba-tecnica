import { beforeEach, describe, expect, test } from 'vitest';

import { Comment } from '@/persistence/entities';
import { TestServer } from '@/tests/utils/test-server';
import { TestUtils } from '@/tests/utils/test-utils';

import { BlogConstants, BlogFixtures } from './fixtures/blog.fixtures';
import { CommentConstants, CommentFixtures } from './fixtures/comment.fixtures';
import { UserConstants, UserFixtures } from './fixtures/user.fixtures';

describe('DELETE /blogs/:blogId/comments/:id - e2e', async () => {
  const testUtils = new TestUtils();
  const testServer = await TestServer.create();

  const authToken = TestUtils.generateJWT({
    sub: UserConstants.ID,
    email: UserConstants.Email
  });

  const authHeader = { authorization: `Bearer ${authToken}` };

  beforeEach(async () => {
    await testUtils.loadFixtures([
      new UserFixtures(),
      new BlogFixtures(),
      new CommentFixtures()
    ]);
  });

  test('removes an owned comment', async () => {
    const res = await testServer.delete<{ id: string }>(
      `/blogs/${BlogConstants.ID}/comments/${CommentConstants.ID}`,
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({ id: CommentConstants.ID });

    const persisted = await testUtils.getRepository(Comment).findOneBy({
      id: CommentConstants.ID
    });

    expect(persisted).toBeNull();
  });

  test('responds COMMENT_NOT_FOUND for an unknown id', async () => {
    const res = await testServer.delete(
      `/blogs/${BlogConstants.ID}/comments/${TestUtils.generateUUID()}`,
      { headers: authHeader }
    );

    expect(res.body.errorCode).toBe('COMMENT_NOT_FOUND');
  });

  test('responds COMMENT_NOT_FOUND when the comment belongs to another blog', async () => {
    const res = await testServer.delete(
      `/blogs/${TestUtils.generateUUID()}/comments/${CommentConstants.ID}`,
      { headers: authHeader }
    );

    expect(res.body.errorCode).toBe('COMMENT_NOT_FOUND');
  });

  test('responds COMMENT_FORBIDDEN when removing a comment owned by someone else', async () => {
    const res = await testServer.delete(
      `/blogs/${BlogConstants.ID}/comments/${CommentConstants.OTHER_ID}`,
      { headers: authHeader }
    );

    expect(res.body.errorCode).toBe('COMMENT_FORBIDDEN');

    const persisted = await testUtils.getRepository(Comment).findOneBy({
      id: CommentConstants.OTHER_ID
    });

    expect(persisted).not.toBeNull();
  });

  test('responds 400 for a malformed id', async () => {
    const res = await testServer.delete(
      `/blogs/${BlogConstants.ID}/comments/not-a-uuid`,
      { headers: authHeader }
    );

    expect(res.statusCode).toBe(400);
  });

  test('responds 401 when no authorization header is provided', async () => {
    const res = await testServer.delete(
      `/blogs/${BlogConstants.ID}/comments/${CommentConstants.ID}`
    );

    expect(res.statusCode).toBe(401);
  });
});
