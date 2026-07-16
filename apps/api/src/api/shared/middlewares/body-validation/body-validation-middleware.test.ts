import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import z from 'zod';

import { bodyValidationMiddleware } from '@/api/shared/middlewares/body-validation';

const schema = z.object({
  email: z.email('email should be a valid email'),
  password: z.string().min(8, 'Password should be grater than 8')
});

const createResponse = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn()
  };

  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);

  return res as unknown as Response & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
};

const next = vi.fn() as unknown as NextFunction;

describe('bodyValidationMiddleware - unit', () => {
  const middleware = bodyValidationMiddleware(schema);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('calls next when the body matches the schema', () => {
    const req = { body: { email: 'jane@test.com', password: 'password123' } } as Request;
    const res = createResponse();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('responds 400 with a body malformed message when the body is invalid', () => {
    const req = { body: { email: 'not-an-email', password: 'short' } } as Request;
    const res = createResponse();

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
