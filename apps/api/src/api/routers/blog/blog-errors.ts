import { ApiError } from '@/api/shared/errors/api-errors';

export class BlogNotFound extends ApiError {
  constructor() {
    super(404, 'Blog not found', 'BLOG_NOT_FOUND');
  }
}

export class BlogForbidden extends ApiError {
  constructor() {
    super(403, 'You are not allowed to modify this blog', 'BLOG_FORBIDDEN');
  }
}
