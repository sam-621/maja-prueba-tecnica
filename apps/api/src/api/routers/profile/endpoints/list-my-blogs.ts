import type { Request, Response } from 'express';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { HttpStatusCode } from '@/api/shared/http-status-code';
import { authorizationMiddleware } from '@/api/shared/middlewares/authorization';
import { queryValidationMiddleware } from '@/api/shared/middlewares/query-validation';
import { Blog } from '@/persistence/entities';

import { Endpoint, EndpointResult } from '../../endpoint';

const listMyBlogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().min(1).optional(),
  categoryIds: z
    .string()
    .optional()
    .transform(value => (value ? value.split(',') : undefined))
    .pipe(z.array(z.uuid()).optional())
});

export class ListMyBlogsEndpoint extends Endpoint {
  constructor() {
    super(
      '/me/blogs',
      [authorizationMiddleware, queryValidationMiddleware(listMyBlogsQuerySchema)],
      'get'
    );
  }

  async execute(req: Request, res: Response): Promise<EndpointResult> {
    const { repositories, currentUser } = res.locals.ctx as Required<RequestContext>;
    const { page, size, search, categoryIds } =
      listMyBlogsQuerySchema.parse(req.query);

    const query = repositories.blog
      .createQueryBuilder('blog')
      .leftJoin('blog.author', 'author')
      .addSelect(['author.id', 'author.fullname', 'author.email'])
      .leftJoinAndSelect('blog.categories', 'category')
      .where('blog.authorId = :authorId', { authorId: currentUser.id })
      .orderBy('blog.createdAt', 'DESC')
      .addOrderBy('blog.id', 'ASC')
      .skip((page - 1) * size)
      .take(size);

    if (search) {
      query.andWhere('blog.title ILIKE :search', { search: `%${search}%` });
    }

    if (categoryIds?.length) {
      const matchingBlogIds = query
        .subQuery()
        .select('blogSub.id')
        .from(Blog, 'blogSub')
        .innerJoin('blogSub.categories', 'category')
        .where('category.id IN (:...categoryIds)')
        .getQuery();

      query
        .andWhere(`blog.id IN ${matchingBlogIds}`)
        .setParameter('categoryIds', categoryIds);
    }

    const [blogs, total] = await query.getManyAndCount();

    return new EndpointResult(HttpStatusCode.Ok, {
      blogs,
      pageInfo: {
        page,
        size,
        totalPages: Math.ceil(total / size)
      }
    });
  }
}
