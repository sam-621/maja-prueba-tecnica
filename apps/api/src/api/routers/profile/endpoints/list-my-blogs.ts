import type { Request, Response } from 'express';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { authorizationMiddleware } from '@/api/shared/middlewares/authorization';
import { queryValidationMiddleware } from '@/api/shared/middlewares/query-validation';
import { Post } from '@/persistence/entities';

import { Endpoint, EndpointResult } from '../../endpoint';

const listMyBlogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().min(1).optional(),
  categoryId: z.uuid().optional()
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
    const { page, size, search, categoryId } =
      listMyBlogsQuerySchema.parse(req.query);

    const query = repositories.post
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
