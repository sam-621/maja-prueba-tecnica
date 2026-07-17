import { rateLimit } from 'express-rate-limit';

import type { EndpointFn } from '@/api/routers/endpoint';
import { HttpStatusCode } from '@/api/shared/http-status-code';
import { config } from '@/config';

export const publicRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => config.env === 'test',
  handler: (_req, res) => {
    res.status(HttpStatusCode.TooManyRequests).json({
      message: 'Too many attempts, please try again later',
      errorCode: 'TOO_MANY_REQUESTS'
    });
  }
}) as EndpointFn;
