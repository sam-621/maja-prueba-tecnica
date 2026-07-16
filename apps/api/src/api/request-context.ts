import type { DataSource, Repository } from 'typeorm';

import { Blog, Category, Comment, User } from '@/persistence/entities';

import type { EndpointFn } from './routers/endpoint';

export type RequestContext = {
  repositories: {
    user: Repository<User>;
    blog: Repository<Blog>;
    comment: Repository<Comment>;
    category: Repository<Category>;
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
          blog: dataSource.getRepository(Blog),
          comment: dataSource.getRepository(Comment),
          category: dataSource.getRepository(Category)
        }
      } satisfies RequestContext
    };

    next();
  };
