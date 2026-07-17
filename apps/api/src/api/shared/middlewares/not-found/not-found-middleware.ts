import type { EndpointFn } from '@/api/routers/endpoint';
import { HttpStatusCode } from '@/api/shared/http-status-code';

export const notFoundMiddleware: EndpointFn = (_req, res) => {
  res
    .status(HttpStatusCode.NotFound)
    .json({ message: 'Resource not found', errorCode: 'NOT_FOUND' });
};
