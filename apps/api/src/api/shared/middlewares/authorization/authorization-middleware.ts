import type { RequestContext } from '@/api/request-context';
import type { EndpointFn } from '@/api/routers/endpoint';

export const authorizationMiddleware: EndpointFn = (_, res, next) => {
  const { currentUser } = res.locals.ctx as RequestContext;

  if (!currentUser) {
    res.status(401).json({ message: 'unauthorized' });
    return;
  }

  next();
};
