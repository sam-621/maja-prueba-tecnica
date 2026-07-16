import type { ZodObject } from 'zod';

import type { EndpointFn } from '@/api/routers/endpoint';

export const queryValidationMiddleware =
  (schema: ZodObject): EndpointFn =>
  (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      res
        .status(400)
        .json({ message: 'query malformed', details: result.error.message });

      return;
    }

    next();
  };
