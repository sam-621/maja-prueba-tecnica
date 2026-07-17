import type { ZodObject } from 'zod';

import type { EndpointFn } from '@/api/routers/endpoint';
import { HttpStatusCode } from '@/api/shared/http-status-code';

export const paramsValidationMiddleware =
  (schema: ZodObject): EndpointFn =>
  (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      res.status(HttpStatusCode.BadRequest).json({
        message: 'params malformed',
        errorCode: 'VALIDATION_ERROR',
        details: result.error.message
      });

      return;
    }

    next();
  };
