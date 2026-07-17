import type { NextFunction, Request, Response } from 'express';

import type { HttpStatusCode } from '@/api/shared/http-status-code';

export abstract class Endpoint {
  constructor(
    readonly route: `/${string}`,
    readonly middlewares: EndpointFn[],
    readonly httpMethod: 'get' | 'post' | 'put' | 'patch' | 'delete'
  ) {}

  abstract execute(req: Request, res: Response): Promise<EndpointResult>;
}

export type EndpointFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export class EndpointResult {
  constructor(
    readonly statusCode: HttpStatusCode,
    readonly data: any
  ) {}
}
