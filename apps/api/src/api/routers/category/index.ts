import { Router } from '../router';

import { CreateCategoryEndpoint } from './endpoints/create-category';
import { ListCategoriesEndpoint } from './endpoints/list-categories';

export class CategoryRouter extends Router {
  constructor() {
    super([new ListCategoriesEndpoint(), new CreateCategoryEndpoint()]);
  }
}
