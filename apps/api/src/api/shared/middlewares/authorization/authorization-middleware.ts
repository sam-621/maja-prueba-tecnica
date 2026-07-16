import type { RequestContext } from '@/api/request-context';
import type { EndpointFn } from '@/api/routers/endpoint';
import { jwt } from '@/libs/jwt';

export type AccessTokenPayload = {
  sub: string;
  email: string;
};

const BEARER_PREFIX = 'Bearer ';

export const authorizationMiddleware: EndpointFn = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith(BEARER_PREFIX)) {
    res.status(401).json({ message: 'unauthorized' });
    return;
  }

  const token = header.slice(BEARER_PREFIX.length).trim();

  if (!token) {
    res.status(401).json({ message: 'unauthorized' });
    return;
  }

  const payload = jwt.verify<AccessTokenPayload>(token);

  if (!payload) {
    res.status(401).json({ message: 'unauthorized' });
    return;
  }

  const { repositories } = res.locals.ctx as RequestContext;

  const user = await repositories.user.findOneBy({ id: payload.sub });

  if (!user) {
    res.status(401).json({ message: 'unauthorized' });
    return;
  }

  res.locals.ctx.currentUser = user;

  next();
};
