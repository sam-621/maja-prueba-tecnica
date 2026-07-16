import type { Request, Response } from 'express';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { bodyValidationMiddleware } from '@/api/shared/middlewares/body-validation';
import { hasher } from '@/libs/hasher';
import { jwt } from '@/libs/jwt';

import { Endpoint, EndpointResult } from '../../endpoint';
import { EmailAlreadyTaken } from '../auth-errors';

const signUpInputSchema = z.object({
  email: z.email('email should be a valid email'),
  password: z.string().min(8, 'Password should be grater than 8'),
  fullname: z.string().min(1, 'Fullname should not be empty')
});

type SignUpInput = z.infer<typeof signUpInputSchema>;

export class SignUpEndpoint extends Endpoint {
  constructor() {
    super('/signup', [bodyValidationMiddleware(signUpInputSchema)], 'post');
  }

  async execute(req: Request, res: Response): Promise<EndpointResult> {
    const { repositories } = res.locals.ctx as RequestContext;
    const input = req.body as SignUpInput;

    const emailAlreadyExists = await repositories.user.findOneBy({ email: input.email });

    if (emailAlreadyExists) {
      throw new EmailAlreadyTaken();
    }

    const hashedPassword = await hasher.hash(input.password);

    const user = await repositories.user.save({
      email: input.email,
      fullname: input.fullname,
      passwordHash: hashedPassword
    });

    const accessToken = jwt.generate({ email: user.email, sub: user.id });

    return new EndpointResult(201, accessToken);
  }
}
