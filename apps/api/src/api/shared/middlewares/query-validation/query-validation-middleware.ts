import type { ZodObject } from 'zod';

import type { EndpointFn } from '@/api/routers/endpoint';
import { HttpStatusCode } from '@/api/shared/http-status-code';

export const queryValidationMiddleware =
  (schema: ZodObject): EndpointFn =>
  (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      res.status(HttpStatusCode.BadRequest).json({
        message: 'query malformed',
        errorCode: 'VALIDATION_ERROR',
        details: result.error.message
      });

      return;
    }

    next();
  };
