import type { Request } from 'express';
import type { DataSource, Repository } from 'typeorm';

import { jwt } from '@/libs/jwt';
import { Blog, Category, Comment, User } from '@/persistence/entities';

import type { EndpointFn } from './routers/endpoint';

export type AccessTokenPayload = {
  sub: string;
  email: string;
};

export type RequestContext = {
  repositories: {
    user: Repository<User>;
    blog: Repository<Blog>;
    comment: Repository<Comment>;
    category: Repository<Category>;
  };
  currentUser?: User;
};

const BEARER_PREFIX = 'Bearer ';

export const requestContextMiddleware =
  (dataSource: DataSource): EndpointFn =>
  async (req, res, next) => {
    const repositories = {
      user: dataSource.getRepository(User),
      blog: dataSource.getRepository(Blog),
      comment: dataSource.getRepository(Comment),
      category: dataSource.getRepository(Category)
    };

    const currentUser = await resolveCurrentUser(req, repositories.user);

    res.locals = {
      ctx: { repositories, currentUser } satisfies RequestContext
    };

    next();
  };

const resolveCurrentUser = async (
  req: Request,
  userRepository: Repository<User>
): Promise<User | undefined> => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith(BEARER_PREFIX)) return undefined;

  const token = header.slice(BEARER_PREFIX.length).trim();

  if (!token) return undefined;

  const payload = jwt.verify<AccessTokenPayload>(token);

  if (!payload) return undefined;

  const user = await userRepository.findOneBy({ id: payload.sub });

  return user ?? undefined;
};
