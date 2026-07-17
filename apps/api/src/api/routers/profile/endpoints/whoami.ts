import type { Request, Response } from 'express';

import type { RequestContext } from '@/api/request-context';
import { HttpStatusCode } from '@/api/shared/http-status-code';
import { authorizationMiddleware } from '@/api/shared/middlewares/authorization';

import { Endpoint, EndpointResult } from '../../endpoint';

export class WhoamiEndpoint extends Endpoint {
  constructor() {
    super('/whoami', [authorizationMiddleware], 'get');
  }

  async execute(_req: Request, res: Response): Promise<EndpointResult> {
    const { currentUser } = res.locals.ctx as Required<RequestContext>;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _passwordHash, ...profile } = currentUser;

    return new EndpointResult(HttpStatusCode.Ok, profile);
  }
}
