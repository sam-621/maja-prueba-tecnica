import type { Request, Response } from 'express';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { sanitizationMiddleware } from '@/api/shared/middlewares/sanitization';
import { hasher } from '@/libs/hasher';
import { jwt } from '@/libs/jwt';

import { Endpoint, EndpointResult } from '../../endpoint';
import { InvalidCredentials } from '../auth-errors';

const loginInputSchema = z.object({
  email: z.email('email should be a valid email'),
  password: z.string().min(8, 'Password should be grater than 8')
});

type LoginInput = z.infer<typeof loginInputSchema>;

export class LoginEndpoint extends Endpoint {
  constructor() {
    super('/login', [sanitizationMiddleware(loginInputSchema)], 'post');
  }

  async execute(req: Request, res: Response): Promise<EndpointResult> {
    const { repositories } = res.locals.ctx as RequestContext;
    const input = req.body as LoginInput;

    const user = await repositories.user.findOneBy({ email: input.email });

    if (!user) {
      throw new InvalidCredentials();
    }

    const passwordMatches = await hasher.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new InvalidCredentials();
    }

    const accessToken = jwt.generate({ email: user.email, sub: user.id });

    return new EndpointResult(200, accessToken);
  }
}
