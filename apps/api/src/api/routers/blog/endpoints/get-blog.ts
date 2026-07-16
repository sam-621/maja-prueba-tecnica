import type { Request, Response } from 'express';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { paramsValidationMiddleware } from '@/api/shared/middlewares/params-validation';

import { Endpoint, EndpointResult } from '../../endpoint';
import { BlogNotFound } from '../blog-errors';

const blogParamsSchema = z.object({
  slug: z.string().min(1, 'slug should not be empty')
});

export class GetBlogEndpoint extends Endpoint {
  constructor() {
    super('/blogs/:slug', [paramsValidationMiddleware(blogParamsSchema)], 'get');
  }

  async execute(req: Request, res: Response): Promise<EndpointResult> {
    const { repositories } = res.locals.ctx as RequestContext;
    const slug = req.params.slug as string;

    const blog = await repositories.post.findOne({
      where: { slug },
      relations: { categories: true }
    });

    if (!blog) {
      throw new BlogNotFound();
    }

    return new EndpointResult(200, blog);
  }
}
