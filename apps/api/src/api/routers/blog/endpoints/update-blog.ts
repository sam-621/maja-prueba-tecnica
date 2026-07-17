import type { Request, Response } from 'express';
import { In } from 'typeorm';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { HttpStatusCode } from '@/api/shared/http-status-code';
import { authorizationMiddleware } from '@/api/shared/middlewares/authorization';
import { bodyValidationMiddleware } from '@/api/shared/middlewares/body-validation';
import { paramsValidationMiddleware } from '@/api/shared/middlewares/params-validation';

import { Endpoint, EndpointResult } from '../../endpoint';
import { BlogForbidden, BlogNotFound } from '../blog-errors';

const blogParamsSchema = z.object({
  id: z.uuid('id should be a valid uuid')
});

const updateBlogInputSchema = z.object({
  title: z.string().min(1, 'Title should not be empty').optional(),
  content: z.string().min(1, 'Content should not be empty').optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  categoryIds: z.array(z.uuid()).optional()
});

type UpdateBlogInput = z.infer<typeof updateBlogInputSchema>;

export class UpdateBlogEndpoint extends Endpoint {
  constructor() {
    super(
      '/blogs/:id',
      [
        authorizationMiddleware,
        paramsValidationMiddleware(blogParamsSchema),
        bodyValidationMiddleware(updateBlogInputSchema)
      ],
      'patch'
    );
  }

  async execute(req: Request, res: Response): Promise<EndpointResult> {
    const { repositories, currentUser } = res.locals.ctx as Required<RequestContext>;
    const id = req.params.id as string;

    const blog = await repositories.blog.findOne({
      where: { id },
      relations: { categories: true }
    });

    if (!blog) {
      throw new BlogNotFound();
    }

    if (blog.authorId !== currentUser.id) {
      throw new BlogForbidden();
    }

    const { categoryIds, ...input } = req.body as UpdateBlogInput;

    if (categoryIds) {
      blog.categories = await this.resolveCategories(repositories, categoryIds);
    }

    const updated = await repositories.blog.save({ ...blog, ...input });

    return new EndpointResult(HttpStatusCode.Ok, updated);
  }

  private async resolveCategories(
    repositories: RequestContext['repositories'],
    categoryIds: string[]
  ) {
    const uniqueIds = [...new Set(categoryIds)];

    if (uniqueIds.length === 0) return [];

    return repositories.category.findBy({ id: In(uniqueIds) });
  }
}
