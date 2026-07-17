import type { Request, Response } from 'express';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { HttpStatusCode } from '@/api/shared/http-status-code';
import { authorizationMiddleware } from '@/api/shared/middlewares/authorization';
import { paramsValidationMiddleware } from '@/api/shared/middlewares/params-validation';

import { Endpoint, EndpointResult } from '../../endpoint';
import { BlogForbidden, BlogNotFound } from '../blog-errors';

const blogParamsSchema = z.object({
  id: z.uuid('id should be a valid uuid')
});

export class RemoveBlogEndpoint extends Endpoint {
  constructor() {
    super(
      '/blogs/:id',
      [authorizationMiddleware, paramsValidationMiddleware(blogParamsSchema)],
      'delete'
    );
  }

  async execute(req: Request, res: Response): Promise<EndpointResult> {
    const { repositories, currentUser } = res.locals.ctx as Required<RequestContext>;
    const id = req.params.id as string;

    const blog = await repositories.blog.findOneBy({ id });

    if (!blog) {
      throw new BlogNotFound();
    }

    if (blog.authorId !== currentUser.id) {
      throw new BlogForbidden();
    }

    await repositories.blog.remove(blog);

    return new EndpointResult(HttpStatusCode.Ok, { id });
  }
}
