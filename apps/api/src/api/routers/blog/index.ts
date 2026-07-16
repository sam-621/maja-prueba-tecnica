import { Router } from '../router';

import { CreateBlogEndpoint } from './endpoints/create-blog';
import { GetBlogEndpoint } from './endpoints/get-blog';
import { ListBlogsEndpoint } from './endpoints/list-blogs';
import { RemoveBlogEndpoint } from './endpoints/remove-blog';
import { UpdateBlogEndpoint } from './endpoints/update-blog';

export class BlogRouter extends Router {
  constructor() {
    super([
      new CreateBlogEndpoint(),
      new ListBlogsEndpoint(),
      new GetBlogEndpoint(),
      new UpdateBlogEndpoint(),
      new RemoveBlogEndpoint()
    ]);
  }
}
