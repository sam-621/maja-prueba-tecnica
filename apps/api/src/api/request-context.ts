import type { DataSource } from 'typeorm';

import type { Endpoint } from './api-types';

export type RequestContext = {
  dataSource: DataSource;
};

export const requestContextMiddleware =
  (dataSource: DataSource): Endpoint =>
  (_, res, next) => {
    res.locals = {
      context: {
        dataSource
      } satisfies RequestContext
    };

    next();
  };
