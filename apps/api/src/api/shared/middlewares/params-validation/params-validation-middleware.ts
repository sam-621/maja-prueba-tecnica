import type { ZodObject } from 'zod';

import type { EndpointFn } from '@/api/routers/endpoint';

export const paramsValidationMiddleware =
  (schema: ZodObject): EndpointFn =>
  (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      res
        .status(400)
        .json({ message: 'params malformed', details: result.error.message });

      return;
    }

    next();
  };
