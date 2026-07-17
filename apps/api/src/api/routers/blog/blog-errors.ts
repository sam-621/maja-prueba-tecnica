import { ApiError } from '@/api/shared/errors/api-errors';
import { HttpStatusCode } from '@/api/shared/http-status-code';

export class BlogNotFound extends ApiError {
  constructor() {
    super(HttpStatusCode.NotFound, 'Blog not found', 'BLOG_NOT_FOUND');
  }
}

export class BlogForbidden extends ApiError {
  constructor() {
    super(HttpStatusCode.Forbidden, 'You are not allowed to modify this blog', 'BLOG_FORBIDDEN');
  }
}
