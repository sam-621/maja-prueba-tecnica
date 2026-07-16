import type { DataSource, Repository } from 'typeorm';

import { Comment, Post, User } from '@/persistence/entities';

import type { EndpointFn } from './routers/endpoint';

export type RequestContext = {
  repositories: {
    user: Repository<User>;
    post: Repository<Post>;
    comment: Repository<Comment>;
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
          post: dataSource.getRepository(Post),
          comment: dataSource.getRepository(Comment)
        }
      } satisfies RequestContext
    };

    next();
  };
