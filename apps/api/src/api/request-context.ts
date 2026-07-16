import type { DataSource, Repository } from 'typeorm';

import { Post, User } from '@/persistence/entities';

import type { EndpointFn } from './routers/endpoint';

export type RequestContext = {
  repositories: {
    user: Repository<User>;
    post: Repository<Post>;
  };
  currentUser?: User;
};

export const requestContextMiddleware =
  (dataSource: DataSource): EndpointFn =>
  (_, res, next) => {
    res.locals = {
      ctx: {
        repositories: {
          user: dataSource.getRepository(User),
          post: dataSource.getRepository(Post)
        }
      } satisfies RequestContext
    };

    next();
  };
