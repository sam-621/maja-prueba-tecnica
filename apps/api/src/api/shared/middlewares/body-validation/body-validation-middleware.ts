import type { ZodObject } from 'zod';

import type { EndpointFn } from '@/api/routers/endpoint';
import { HttpStatusCode } from '@/api/shared/http-status-code';

export const bodyValidationMiddleware =
  (schema: ZodObject): EndpointFn =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(HttpStatusCode.BadRequest).json({
        message: 'body malformed',
        errorCode: 'VALIDATION_ERROR',
        details: result.error.message
      });

      return;
    }

    next();
  };
