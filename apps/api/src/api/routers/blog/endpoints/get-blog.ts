import type { Request, Response } from 'express';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { HttpStatusCode } from '@/api/shared/http-status-code';
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
    const { repositories, currentUser } = res.locals.ctx as RequestContext;
    const slug = req.params.slug as string;

    const blog = await repositories.blog
      .createQueryBuilder('blog')
      .leftJoin('blog.author', 'author')
      .addSelect(['author.id', 'author.fullname', 'author.email'])
      .leftJoinAndSelect('blog.categories', 'category')
      .where('blog.slug = :slug', { slug })
      .getOne();

    if (!blog) {
      throw new BlogNotFound();
    }

    const isPublished = blog.status === 'published';
    const isAuthor = currentUser?.id === blog.authorId;

    if (!isPublished && !isAuthor) {
      throw new BlogNotFound();
    }

    return new EndpointResult(HttpStatusCode.Ok, blog);
  }
}
