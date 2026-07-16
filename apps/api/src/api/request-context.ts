import type { DataSource, Repository } from 'typeorm';

import { User } from '@/persistence/entities';

import type { EndpointFn } from './routers/endpoint';

export type RequestContext = {
  repositories: {
    user: Repository<User>;
  };
};

export const requestContextMiddleware =
  (dataSource: DataSource): EndpointFn =>
  (_, res, next) => {
    res.locals = {
      ctx: {
        repositories: {
          user: dataSource.getRepository(User)
        }
      } satisfies RequestContext
    };

    next();
  };
