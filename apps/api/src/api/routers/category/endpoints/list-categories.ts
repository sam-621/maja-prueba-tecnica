import type { Request, Response } from 'express';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { queryValidationMiddleware } from '@/api/shared/middlewares/query-validation';

import { Endpoint, EndpointResult } from '../../endpoint';

const listCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().min(1).optional()
});

export class ListCategoriesEndpoint extends Endpoint {
  constructor() {
    super('/categories', [queryValidationMiddleware(listCategoriesQuerySchema)], 'get');
  }

  async execute(req: Request, res: Response): Promise<EndpointResult> {
    const { repositories } = res.locals.ctx as RequestContext;
    const { page, size, search } = listCategoriesQuerySchema.parse(req.query);

    const query = repositories.category
      .createQueryBuilder('category')
      .orderBy('category.name', 'ASC')
      .skip((page - 1) * size)
      .take(size);

    if (search) {
      query.andWhere('category.name ILIKE :search', { search: `%${search}%` });
    }

    const [categories, total] = await query.getManyAndCount();

    return new EndpointResult(200, {
      categories,
      pageInfo: {
        page,
        size,
        totalPages: Math.ceil(total / size)
      }
    });
  }
}
