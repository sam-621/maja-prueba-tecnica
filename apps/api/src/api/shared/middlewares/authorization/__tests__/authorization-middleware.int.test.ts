import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';

import { requestContextMiddleware } from '@/api/request-context';
import { authorizationMiddleware } from '@/api/shared/middlewares/authorization';
import { dataSource } from '@/persistence/data-source';
import { TestUtils } from '@/tests/utils/test-utils';

import { UserConstants, UserFixtures } from './fixtures/user.fixtures';

const app = express();
app.use(express.json());
app.use(requestContextMiddleware(dataSource));
app.get('/protected', authorizationMiddleware, (_req, res) => {
  const { currentUser } = res.locals.ctx;

  res.status(200).json({ id: currentUser.id, email: currentUser.email });
});

const testUtils = new TestUtils();

describe('authorizationMiddleware', () => {
  beforeEach(async () => {
    await testUtils.loadFixtures([new UserFixtures()]);
  });

  test('allows the request and exposes the current user for a valid token', async () => {
    const token = TestUtils.generateJWT({
      sub: UserConstants.ID,
      email: UserConstants.Email
    });

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ id: UserConstants.ID, email: UserConstants.Email });
  });

  test('responds 401 when the token is valid but the user no longer exists', async () => {
    const token = TestUtils.generateJWT({
      sub: TestUtils.generateUUID(),
      email: 'ghost@test.com'
    });

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(401);
  });

  test('responds 401 when the token is invalid', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer not-a-real-token');

    expect(res.statusCode).toBe(401);
  });

  test('responds 401 when the authorization header is missing', async () => {
    const res = await request(app).get('/protected');

    expect(res.statusCode).toBe(401);
  });

  test('responds 401 when the header does not use the Bearer scheme', async () => {
    const token = TestUtils.generateJWT({
      sub: UserConstants.ID,
      email: UserConstants.Email
    });

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Basic ${token}`);

    expect(res.statusCode).toBe(401);
  });
});
