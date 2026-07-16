import type { Request, Response } from 'express';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { authorizationMiddleware } from '@/api/shared/middlewares/authorization';
import { bodyValidationMiddleware } from '@/api/shared/middlewares/body-validation';

import { Endpoint, EndpointResult } from '../../endpoint';

const createBlogInputSchema = z.object({
  title: z.string().min(1, 'Title should not be empty'),
  content: z.string().min(1, 'Content should not be empty'),
  status: z.enum(['draft', 'published', 'archived']).optional()
});

type CreateBlogInput = z.infer<typeof createBlogInputSchema>;

export class CreateBlogEndpoint extends Endpoint {
  constructor() {
    super(
      '/blogs',
      [authorizationMiddleware, bodyValidationMiddleware(createBlogInputSchema)],
      'post'
    );
  }

  async execute(req: Request, res: Response): Promise<EndpointResult> {
    const { repositories, currentUser } = res.locals.ctx as Required<RequestContext>;
    const input = req.body as CreateBlogInput;

    const blog = await repositories.post.save({
      title: input.title,
      content: input.content,
      status: input.status ?? 'draft',
      authorId: currentUser.id
    });

    return new EndpointResult(201, blog);
  }
}
