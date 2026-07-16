import type { Request, Response } from 'express';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { queryValidationMiddleware } from '@/api/shared/middlewares/query-validation';
import { Post } from '@/persistence/entities';

import { Endpoint, EndpointResult } from '../../endpoint';

const listBlogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
  title: z.string().min(1).optional(),
  fullname: z.string().min(1).optional(),
  categoryId: z.uuid().optional()
});

export class ListBlogsEndpoint extends Endpoint {
  constructor() {
    super('/blogs', [queryValidationMiddleware(listBlogsQuerySchema)], 'get');
  }

  async execute(req: Request, res: Response): Promise<EndpointResult> {
    const { repositories } = res.locals.ctx as RequestContext;
    const { page, size, title, fullname, categoryId } =
      listBlogsQuerySchema.parse(req.query);

    const query = repositories.post
      .createQueryBuilder('blog')
      .leftJoin('blog.author', 'author')
      .addSelect(['author.id', 'author.fullname', 'author.email'])
      .orderBy('blog.createdAt', 'DESC')
      .addOrderBy('blog.id', 'ASC')
      .skip((page - 1) * size)
      .take(size);

    if (title) {
      query.andWhere('blog.title ILIKE :title', { title: `%${title}%` });
    }

    if (fullname) {
      query.andWhere('author.fullname ILIKE :fullname', { fullname: `%${fullname}%` });
    }

    if (categoryId) {
      const matchingBlogIds = query
        .subQuery()
        .select('post.id')
        .from(Post, 'post')
        .innerJoin('post.categories', 'category')
        .where('category.id = :categoryId')
        .getQuery();

      query
        .andWhere(`blog.id IN ${matchingBlogIds}`)
        .setParameter('categoryId', categoryId);
    }

    const [blogs, total] = await query.getManyAndCount();

    return new EndpointResult(200, {
      blogs,
      pageInfo: {
        page,
        size,
        totalPages: Math.ceil(total / size)
      }
    });
  }
}
