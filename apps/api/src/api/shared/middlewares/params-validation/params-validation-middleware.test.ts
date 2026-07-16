import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import z from 'zod';

import { paramsValidationMiddleware } from '@/api/shared/middlewares/params-validation';

const schema = z.object({
  id: z.uuid('id should be a valid uuid')
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

describe('paramsValidationMiddleware', () => {
  const middleware = paramsValidationMiddleware(schema);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('calls next when the params match the schema', () => {
    const req = { params: { id: crypto.randomUUID() } } as unknown as Request;
    const res = createResponse();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('responds 400 with a params malformed message when a param is invalid', () => {
    const req = { params: { id: 'not-a-uuid' } } as unknown as Request;
    const res = createResponse();

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
