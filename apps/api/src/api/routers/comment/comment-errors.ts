import { ApiError } from '@/api/shared/errors/api-errors';
import { HttpStatusCode } from '@/api/shared/http-status-code';

export class CommentNotFound extends ApiError {
  constructor() {
    super(HttpStatusCode.NotFound, 'Comment not found', 'COMMENT_NOT_FOUND');
  }
}

export class CommentForbidden extends ApiError {
  constructor() {
    super(HttpStatusCode.Forbidden, 'You are not allowed to modify this comment', 'COMMENT_FORBIDDEN');
  }
}
