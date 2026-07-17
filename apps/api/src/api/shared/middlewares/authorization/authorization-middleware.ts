import type { RequestContext } from '@/api/request-context';
import type { EndpointFn } from '@/api/routers/endpoint';
import { HttpStatusCode } from '@/api/shared/http-status-code';

export const authorizationMiddleware: EndpointFn = (_, res, next) => {
  const { currentUser } = res.locals.ctx as RequestContext;

  if (!currentUser) {
    res
      .status(HttpStatusCode.Unauthorized)
      .json({ message: 'unauthorized', errorCode: 'UNAUTHORIZED' });
    return;
  }

  next();
};
