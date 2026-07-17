import type { Request, Response } from 'express';
import z from 'zod';

import type { RequestContext } from '@/api/request-context';
import { HttpStatusCode } from '@/api/shared/http-status-code';
import { authorizationMiddleware } from '@/api/shared/middlewares/authorization';
import { bodyValidationMiddleware } from '@/api/shared/middlewares/body-validation';
import { slugify } from '@/libs/slugify';

import { Endpoint, EndpointResult } from '../../endpoint';
import { CategoryAlreadyExists } from '../category-errors';

const createCategoryInputSchema = z.object({
  name: z.string().trim().min(1, 'Name should not be empty').max(100)
});

type CreateCategoryInput = z.infer<typeof createCategoryInputSchema>;

export class CreateCategoryEndpoint extends Endpoint {
  constructor() {
    super(
      '/categories',
      [authorizationMiddleware, bodyValidationMiddleware(createCategoryInputSchema)],
      'post'
    );
  }

  async execute(req: Request, res: Response): Promise<EndpointResult> {
    const { repositories } = res.locals.ctx as RequestContext;
    const input = req.body as CreateCategoryInput;
    const slug = slugify(input.name);

    const existing = await repositories.category.findOne({
      where: [{ name: input.name }, { slug }]
    });

    if (existing) {
      throw new CategoryAlreadyExists();
    }

    const category = await repositories.category.save({ name: input.name, slug });

    return new EndpointResult(HttpStatusCode.Created, category);
  }
}
