import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import z from 'zod';

import { queryValidationMiddleware } from '@/api/shared/middlewares/query-validation';

const schema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  status: z.enum(['draft', 'published', 'archived']).optional()
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

describe('queryValidationMiddleware', () => {
  const middleware = queryValidationMiddleware(schema);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('calls next when the query matches the schema', () => {
    const req = { query: { page: '2', status: 'draft' } } as unknown as Request;
    const res = createResponse();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('calls next when optional params are omitted', () => {
    const req = { query: {} } as unknown as Request;
    const res = createResponse();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  test('responds 400 when a param is invalid', () => {
    const req = { query: { page: 'not-a-number' } } as unknown as Request;
    const res = createResponse();

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errorCode: 'VALIDATION_ERROR' })
    );
  });
});
