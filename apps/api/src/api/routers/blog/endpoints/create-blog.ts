import type { Request, Response } from 'express';
import { In } from 'typeorm';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { authorizationMiddleware } from '@/api/shared/middlewares/authorization';
import { bodyValidationMiddleware } from '@/api/shared/middlewares/body-validation';
import { slugify } from '@/libs/slugify';

import { Endpoint, EndpointResult } from '../../endpoint';

const createBlogInputSchema = z.object({
  title: z.string().min(1, 'Title should not be empty'),
  content: z.string().min(1, 'Content should not be empty'),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  categoryIds: z.array(z.uuid()).optional()
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

    const categories = input.categoryIds
      ? await this.resolveCategories(repositories, input.categoryIds)
      : [];

    const slug = await this.generateUniqueSlug(repositories, input.title);

    const blog = await repositories.blog.save({
      title: input.title,
      slug,
      content: input.content,
      status: input.status ?? 'draft',
      authorId: currentUser.id,
      categories
    });

    return new EndpointResult(201, blog);
  }

  private async generateUniqueSlug(
    repositories: RequestContext['repositories'],
    title: string
  ): Promise<string> {
    const base = slugify(title) || 'blog';
    let candidate = base;
    let suffix = 2;

    while (await repositories.blog.findOneBy({ slug: candidate })) {
      candidate = `${base}-${suffix}`;
      suffix++;
    }

    return candidate;
  }

  private async resolveCategories(
    repositories: RequestContext['repositories'],
    categoryIds: string[]
  ) {
    const uniqueIds = [...new Set(categoryIds)];

    return repositories.category.findBy({ id: In(uniqueIds) });
  }
}
