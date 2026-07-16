import type { Request, Response } from 'express';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { paramsValidationMiddleware } from '@/api/shared/middlewares/params-validation';

import { Endpoint, EndpointResult } from '../../endpoint';
import { BlogNotFound } from '../blog-errors';

const blogParamsSchema = z.object({
  id: z.uuid('id should be a valid uuid')
});

export class GetBlogEndpoint extends Endpoint {
  constructor() {
    super('/blogs/:id', [paramsValidationMiddleware(blogParamsSchema)], 'get');
  }

  async execute(req: Request, res: Response): Promise<EndpointResult> {
    const { repositories } = res.locals.ctx as RequestContext;
    const id = req.params.id as string;

    const blog = await repositories.post.findOne({
      where: { id },
      relations: { categories: true }
    });

    if (!blog) {
      throw new BlogNotFound();
    }

    return new EndpointResult(200, blog);
  }
}
