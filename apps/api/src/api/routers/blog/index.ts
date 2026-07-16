import { Router } from '../router';

import { CreateBlogEndpoint } from './endpoints/create-blog';

export class BlogRouter extends Router {
  constructor() {
    super([new CreateBlogEndpoint()]);
  }
}
