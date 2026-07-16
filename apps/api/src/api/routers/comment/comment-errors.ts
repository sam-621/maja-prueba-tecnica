import { ApiError } from '@/api/shared/errors/api-errors';

export class CommentNotFound extends ApiError {
  constructor() {
    super(404, 'Comment not found', 'COMMENT_NOT_FOUND');
  }
}

export class CommentForbidden extends ApiError {
  constructor() {
    super(403, 'You are not allowed to modify this comment', 'COMMENT_FORBIDDEN');
  }
}
