import type { Request, Response } from 'express';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { authorizationMiddleware } from '@/api/shared/middlewares/authorization';
import { bodyValidationMiddleware } from '@/api/shared/middlewares/body-validation';
import { paramsValidationMiddleware } from '@/api/shared/middlewares/params-validation';

import { BlogNotFound } from '../../blog/blog-errors';
import { Endpoint, EndpointResult } from '../../endpoint';

const commentParamsSchema = z.object({
  blogId: z.uuid('blogId should be a valid uuid')
});

const createCommentInputSchema = z.object({
  content: z.string().min(1, 'Content should not be empty')
});

type CreateCommentInput = z.infer<typeof createCommentInputSchema>;

export class CreateCommentEndpoint extends Endpoint {
  constructor() {
    super(
      '/blogs/:blogId/comments',
      [
        authorizationMiddleware,
        paramsValidationMiddleware(commentParamsSchema),
        bodyValidationMiddleware(createCommentInputSchema)
      ],
      'post'
    );
  }

  async execute(req: Request, res: Response): Promise<EndpointResult> {
    const { repositories, currentUser } = res.locals.ctx as Required<RequestContext>;
    const blogId = req.params.blogId as string;
    const input = req.body as CreateCommentInput;

    const blog = await repositories.blog.findOneBy({ id: blogId });

    if (!blog || blog.status !== 'published') {
      throw new BlogNotFound();
    }

    const comment = await repositories.comment.save({
      content: input.content,
      blogId,
      authorId: currentUser.id
    });

    return new EndpointResult(201, comment);
  }
}
