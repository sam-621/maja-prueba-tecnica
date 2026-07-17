import { rateLimit } from 'express-rate-limit';

import type { EndpointFn } from '@/api/routers/endpoint';
import { config } from '@/config';

export const publicRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => config.env === 'test',
  handler: (_req, res) => {
    res.status(429).json({
      message: 'Too many attempts, please try again later',
      errorCode: 'TOO_MANY_REQUESTS'
    });
  }
}) as EndpointFn;
