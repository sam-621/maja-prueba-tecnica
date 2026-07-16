import { Router as ExpressRouter } from 'express';

import { logger } from '@/logger';

import { ApiError } from '../shared/errors/api-errors';

import type { Endpoint, EndpointFn } from './endpoint';

export abstract class Router {
  readonly router = ExpressRouter();

  constructor(endpoints: Endpoint[]) {
    this.setupEndpoints(endpoints);
  }

  private setupEndpoints(endpoints: Endpoint[]) {
    endpoints.forEach(endpoint => {
      this.router[endpoint.httpMethod](
        endpoint.route,
        ...endpoint.middlewares,
        this.executeEndpointFn(endpoint.execute)
      );
    });
  }

  private executeEndpointFn(fn: Endpoint['execute']): EndpointFn {
    return async (req, res) => {
      try {
        const result = await fn(req, res);

        res.status(result.statusCode).json({ data: result.data });
      } catch (error) {
        if (error instanceof ApiError) {
          res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.code
          });

          return;
        }

        res.status(500).json({
          errorMessage: 'Unexpected error',
          errorCode: 'INTERNAL_SERVER_ERROR'
        });
        logger.error('unknown error', error);
      }
    };
  }
}
