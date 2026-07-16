import type { Request, Response } from 'express';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { authorizationMiddleware } from '@/api/shared/middlewares/authorization';
import { paramsValidationMiddleware } from '@/api/shared/middlewares/params-validation';

import { Endpoint, EndpointResult } from '../../endpoint';
import { CommentForbidden, CommentNotFound } from '../comment-errors';

const commentParamsSchema = z.object({
  blogId: z.uuid('blogId should be a valid uuid'),
  id: z.uuid('id should be a valid uuid')
});

export class RemoveCommentEndpoint extends Endpoint {
  constructor() {
    super(
      '/blogs/:blogId/comments/:id',
      [authorizationMiddleware, paramsValidationMiddleware(commentParamsSchema)],
      'delete'
    );
  }

  async execute(req: Request, res: Response): Promise<EndpointResult> {
    const { repositories, currentUser } = res.locals.ctx as Required<RequestContext>;
    const { blogId, id } = req.params as { blogId: string; id: string };

    const comment = await repositories.comment.findOneBy({ id, postId: blogId });

    if (!comment) {
      throw new CommentNotFound();
    }

    if (comment.authorId !== currentUser.id) {
      throw new CommentForbidden();
    }

    await repositories.comment.remove(comment);

    return new EndpointResult(200, { id });
  }
}
