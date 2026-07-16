import type { Request, Response } from 'express';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { paramsValidationMiddleware } from '@/api/shared/middlewares/params-validation';
import { queryValidationMiddleware } from '@/api/shared/middlewares/query-validation';

import { BlogNotFound } from '../../blog/blog-errors';
import { Endpoint, EndpointResult } from '../../endpoint';

const commentParamsSchema = z.object({
  blogId: z.uuid('blogId should be a valid uuid')
});

const listCommentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10)
});

export class ListCommentsEndpoint extends Endpoint {
  constructor() {
    super(
      '/blogs/:blogId/comments',
      [
        paramsValidationMiddleware(commentParamsSchema),
        queryValidationMiddleware(listCommentsQuerySchema)
      ],
      'get'
    );
  }

  async execute(req: Request, res: Response): Promise<EndpointResult> {
    const { repositories } = res.locals.ctx as RequestContext;
    const blogId = req.params.blogId as string;
    const { page, size } = listCommentsQuerySchema.parse(req.query);

    const blog = await repositories.blog.findOneBy({ id: blogId });

    if (!blog) {
      throw new BlogNotFound();
    }

    const [comments, total] = await repositories.comment
      .createQueryBuilder('comment')
      .leftJoin('comment.author', 'author')
      .addSelect(['author.id', 'author.fullname', 'author.email'])
      .where('comment.blogId = :blogId', { blogId })
      .orderBy('comment.createdAt', 'DESC')
      .addOrderBy('comment.id', 'ASC')
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();

    return new EndpointResult(200, {
      comments,
      pageInfo: {
        page,
        size,
        totalPages: Math.ceil(total / size)
      }
    });
  }
}
